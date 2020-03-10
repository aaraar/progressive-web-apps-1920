/*
 * Created with https://medium.com/javascript-by-doing/create-a-modern-javascript-router-805fc14d084d
 * Edited for typescript to increase comprehension
 * Check sourcecode at https://github.com/javascript-by-doing/create-a-modern-javascript-router
 */

export interface Route {
    path: RegExp | string
    callback: any
}

export class Router {
    currentUri: string
    routes: Route[]

    constructor(...routes: Route[]) {
        this.routes = routes.map(route => {
            route.path = route.path !== '' ? this.convertRoute(route.path) : ''
            return route
        })
        this.listen()
    }

    add(path, callback) {
        path = this.convertRoute(path)
        this.routes.push({path, callback})
    }

    remove(path) {
        this.routes.forEach((route, index) => {
            if (route.path === path) {
                this.routes.slice(index, 1)
                return this
            }
            return this
        })
    }

    flush() {
        this.routes = []
    }

    convertRoute(route) {
        if (route === '/') return new RegExp(/\//)
        const match = route.match(/(.*)$/)
        let endpoint = match ? match[1] : ''
        endpoint = this.clearSlashes(endpoint).split('/')
        const regexp = endpoint.map(point => point[0] === ':' ? '(.*)' : point).join('\\/')
        return new RegExp(regexp)
    }

    clearSlashes = path => path.toString().replace(/\/$/, '').replace(/^\//, '')

    getEndpoint(url: string = window.location.href) {
        if (url.split('/')[url.split('/').length - 1] === '') return '/'
        const match = url.match(/#(.*)$/)
        const endpoint = match ? match[1] : '/'
        return this.clearSlashes(endpoint)
    }

    navigate(path = '/') {
        window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`
        return this
    }

    listen() {
        this.checkRoute()
        window.addEventListener('hashchange', this.checkRoute)
    }

    checkRoute = () => {
        if (this.currentUri === this.getEndpoint()) return
        this.currentUri = this.getEndpoint()
        this.routes.some(route => {
            const match = this.currentUri.match(route.path)
            if (match) {
                match.shift()
                route.callback.apply({}, match)
                return match
            }
            return false
        })
    }
}