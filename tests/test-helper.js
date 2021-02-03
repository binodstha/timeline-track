import Application from 'timeline-tracking/app';
import config from 'timeline-tracking/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
