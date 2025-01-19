import EventEmitter from 'events'
import { browser } from '$app/environment'

if (browser) {
  window.EventEmitter = EventEmitter
}
