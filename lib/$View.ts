import { type $ContainerOptions, $Container, type $ContainerEventMap } from "elexis/src/node/$Container";
import type { $Node } from "elexis/src/node/$Node";

export interface $ViewOptions extends $ContainerOptions {}
export class $View<Content extends $Node = $Node, EM extends $ViewEventMap<Content> = $ViewEventMap<Content>> extends $Container<HTMLElement, EM> {
    protected viewCache = new Map<any, Content>();
    contentId: any | null = null;
    constructor(options?: $ViewOptions) {
        super('view', options);
    }

    setView(id: any, $node: Content) {
        this.viewCache.set(id, $node);
        return this;
    }

    deleteView(id: any) {
        this.viewCache.delete(id);
        return this;
    }

    deleteAllView() {
        this.viewCache.clear();
        return this;
    }

    switchView(id: any) {
        if (id === this.contentId) return this;
        const nextContent = this.viewCache.get(id);
        if (nextContent === undefined) return this;
        const previousContent = this.currentContent;
        let preventDefault = false;
        this.contentId = id;
        const rendered = () => {
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

export interface $ViewEventMap<Content extends $Node = $Node> extends $ContainerEventMap {
    'beforeSwitch': [{ 
        $view: $View;
        targetId: string;
        previousContent: Content | undefined;
        nextContent: Content;
        preventDefault: () => void; 
        switched: () => void;
        rendered: () => void;
    }];
    'afterSwitch': [{$view: $View, previousId: string}];
    'rendered': [{$view: $View, previousContent: Content | undefined, nextContent: Content}]
}