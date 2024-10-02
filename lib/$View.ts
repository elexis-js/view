import { $Container, $ContainerOptions, $EventManager, $Node } from "elexis";

export interface $ViewOptions extends $ContainerOptions {}
export class $View extends $Container {
    protected viewCache = new Map<string, $Node>();
    events = new $EventManager<$ViewEventMap>().register('beforeSwitch', 'afterSwitch', 'rendered')
    contentId: string | null = null;
    constructor(options?: $ViewOptions) {
        super('view', options);
    }

    setView(id: string, $node: $Node) {
        this.viewCache.set(id, $node);
        return this;
    }

    deleteView(id: string) {
        this.viewCache.delete(id);
        return this;
    }

    deleteAllView() {
        this.viewCache.clear();
        return this;
    }

    switchView(id: string) {
        if (id === this.contentId) return this;
        const nextContent = this.viewCache.get(id);
        if (nextContent === undefined) return this;
        const previousContent = this.currentContent;
        let preventDefault = false;
        const rendered = () => {
            this.contentId = id;
            this.events.fire('rendered', {$view: this, previousContent, nextContent})
        }
        const switched = () => {
            this.events.fire('afterSwitch', {$view: this, previousId: id});
        }
        this.events.fire('beforeSwitch', {
            $view: this, 
            preventDefault: () => preventDefault = true, 
            targetId: id, 
            previousContent,
            nextContent, 
            switched,
            rendered
        })
        if (!preventDefault) {
            console.debug('not prevent default')
            this.content(nextContent);
            rendered();
            switched();
        }
        return this;
    }

    get currentContent() {
        if (!this.contentId) return;
        return this.viewCache.get(this.contentId);
    }
}

export interface $ViewEventMap {
    'beforeSwitch': [$ViewBeforeSwitchEvent];
    'afterSwitch': [{$view: $View, previousId: string}];
    'rendered': [{$view: $View, previousContent: $Node | undefined, nextContent: $Node}]
}

export interface $ViewBeforeSwitchEvent { 
    $view: $View;
    targetId: string;
    previousContent: $Node | undefined;
    nextContent: $Node;
    preventDefault: () => void; 
    switched: () => void;
    rendered: () => void;
}