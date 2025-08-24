import { NekoResources } from '@nekorpg'
import { argv } from 'process'

NekoResources.init().then(() => import(`./${argv.slice(2).join(' ')}.js`))
