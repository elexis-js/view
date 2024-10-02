import 'elexis';
import { $View } from './lib/$View';
declare module 'elexis' {
    export namespace $ {
        export interface TagNameElementMap {
            'view': typeof $View;
        } 
    }
}
$.registerTagName('view', $View)

export * from './lib/$View';