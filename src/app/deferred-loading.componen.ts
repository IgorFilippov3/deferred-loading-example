import { Component, Compiler, Injector, ViewChild, ViewContainerRef, OnInit, Input, OnDestroy, Inject, PLATFORM_ID, ElementRef } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-deferred-loading",
  template: `<div #container></div>`,
})
export class DeferredLoadingComponent implements OnInit, OnDestroy {
  @ViewChild("container", { read: ViewContainerRef }) container: ViewContainerRef;

  @Input() props: any;

  private intersectionObserver: IntersectionObserver;
  private isDestroyed$: Subject<void> = new Subject();

  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private element: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ("IntersectionObserver" in window) {
        this.intersectionObserver = this.createIntersectionObserver();
        this.intersectionObserver.observe(this.element.nativeElement);
      } else {
        this.load();
      }
    }
  }

  async load(): Promise<void> {
    const { module, component } = await this.getContent();
    const moduleFactory = await this.compiler.compileModuleAsync(module);
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(component);
    const { hostView, instance } = componentFactory.create(this.injector);

    Object.entries(this.props).forEach(([key, value]: [string, any]) => {
      if (instance[key] && instance[key].observers) {
        instance[key]
          .pipe(takeUntil(this.isDestroyed$))
          .subscribe((e) => value(e));
      } else {
        instance[key] = value;
      }
    });

    this.container.insert(hostView);
  }

  private async getContent(): Promise<{ module: any, component: any }> {
    const [moduleChunk, componentChunk] = await Promise.all([
      import("./lazy/lazy.module"),
      import("./lazy/lazy.component")
    ]);
    return {
      module: moduleChunk["LazyModule"],
      component: componentChunk["LazyComponent"]
    };
  }

  private createIntersectionObserver(): IntersectionObserver {
    return new IntersectionObserver(entries => this.checkForIntersection(entries));
  }

  private checkForIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (this.isIntersecting(entry)) {
        this.load();
        this.intersectionObserver.unobserve(this.element.nativeElement);
      }
    });
  }

  private isIntersecting(entry: IntersectionObserverEntry): boolean {
    return (<any>entry).isIntersecting && entry.target === this.element.nativeElement;
  } 

  ngOnDestroy(): void {
    this.isDestroyed$.next();
    this.isDestroyed$.complete();
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(this.element.nativeElement);
    }
  }
}