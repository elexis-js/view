import 'elexis/core';
import { $View } from './lib/$View';
declare module 'elexis/core' {
    export namespace $ {
        export interface TagNameElementMap {
            'view': typeof $View;
        } 
    }
}
$.registerTagName('view', $View)

export * from './lib/$View';