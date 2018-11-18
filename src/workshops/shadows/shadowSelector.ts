import * as ko from "knockout";
import template from "./shadowSelector.html";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { StyleService } from "../../styleService";
import { ShadowContract } from "../../contracts/shadowContract";


@Component({
    selector: "shadow-selector",
    template: template,
    injectable: "shadowSelector"
})
export class ShadowSelector {
    @Param()
    public readonly selectedShadow: KnockoutObservable<ShadowContract>;

    @Event()
    public readonly onSelect: (shadow: ShadowContract) => void;

    public shadows: KnockoutObservableArray<ShadowContract>;

    constructor(private readonly styleService: StyleService) {
        this.loadShadows = this.loadShadows.bind(this);
        this.selectShadow = this.selectShadow.bind(this);

        this.shadows = ko.observableArray();
        this.selectedShadow = ko.observable();
    }

    @OnMounted()
    public async loadShadows(): Promise<void> {
        const themeContract = await this.styleService.getStyles();

        const shadows = Object.keys(themeContract.shadows).map((key) => {
            const shadowContract = themeContract.shadows[key];
            return shadowContract;
        });

        this.shadows(shadows);
    }

    public selectShadow(shadow: ShadowContract): void {
        if (this.selectedShadow) {
            this.selectedShadow(shadow);
        }

        if (this.onSelect) {
            this.onSelect(shadow);
        }
    }

    public clearShadows(): void {
        if (this.selectedShadow) {
            this.selectedShadow(null);
        }

        if (this.onSelect) {
            this.onSelect(null);
        }
    }
}