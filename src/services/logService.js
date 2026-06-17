import * as Sentry from "@sentry/react";

function init() {
  Sentry.init({
    dsn: "https://d2856b38eeefead1851b890abf872bc5@o4511151018672128.ingest.de.sentry.io/4511583298453584",
    dataCollection: {
      // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#dataCollection
      // userInfo: false,
      // httpBodies: []
    },
  });
}

function log(err) {
  Sentry.logger.error(err);
}

export default {
  init,
  log,
};
