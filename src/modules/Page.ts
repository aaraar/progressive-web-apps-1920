import {Api} from './Api'

export class Page extends Api {
    title: {
        content: string
        tag: string
    }
    loadingMarkup: string
    dynamicElements: string[]
    markup: string
    app: HTMLElement

    constructor(markup) {
        super()
        this.app = document.getElementById('app')
        this.markup = markup
        this.loadingMarkup =
            `<section>
                <img class="loading" src="img/loading.svg" alt="Loading icon">
            </section>`
    }

    destroy() {
        while (this.app.firstChild) this.app.removeChild(this.app.firstChild)
    }

    render(mode: string = 'markup',
           markup = this.markup,
           adjacent: HTMLElement = this.app,
           where: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' = 'afterbegin',
           destroy: Boolean = true) {
        switch (mode) {
            case 'markup' :
                if (destroy) this.destroy()
                markup.trim()
                adjacent.insertAdjacentHTML(where, markup)
                break
            case 'loading' :
                if (destroy) this.destroy()
                this.render('markup', this.loadingMarkup)
                break
        }
    }
}
