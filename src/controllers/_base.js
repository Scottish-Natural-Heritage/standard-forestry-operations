import express from 'express';

import config from '../config.js';

/**
 * Save a record of our visitor's current page to their session.
 *
 * This will be used to guard access to other pages. This allows us to ensure
 * visitor's can't jump ahead and miss out answers in their registration.
 *
 * @param {object} session An `express-session` object holding our visitor's
 * session.
 * @param {Array} [session.visitedPages] An array of our visitor's previously
 * visited pages.
 * @param {string} page Our visitor's currently viewed page.
 */
const saveVisitedPage = (session, page) => {
  if (session.visitedPages === undefined) {
    session.visitedPages = [];
  }

  if (page !== undefined && page.length > 0) {
    session.visitedPages.push(page);
  }
};

/**
 * Check if the visitor is allowed to visit their current page.
 *
 * We hold a list of previously visited pages in the visitor's session so we
 * check if this page's 'back' link is in that list and kick them out if it
 * isn't. If this page doesn't have a 'back' link then we treat is as a start
 * page and always allow access.
 *
 * @param {object} session An `express-session` object holding our visitor's
 * session.
 * @param {Array} session.visitedPages An array of our visitor's previously
 * visited pages.
 * @param {object} options An object containing this page's options.
 * @param {string} [options.back] The page 'before' our current page in the
 * application.
 *
 * @returns {boolean} Whether the visitor is allowed to visit their current page.
 */
const guardAllows = (session, options) => {
  // Unless the user has a completed licence number they are not allowed to
  // visit the success page.
  if (session.licenceNo === undefined && options.path === 'success') {
    return false;
  }

  // If the current page has no 'back' page then we're on a 'first' page so the
  // visitors are always allowed access.
  if (options.back === undefined || options.back.length === 0) {
    return true;
  }

  // If the visitor hasn't visited any pages, then they won't have visited our
  // prescribed 'last' page, so they are blocked.
  if (session.visitedPages === undefined || session.visitedPages.length === 0) {
    return false;
  }

  // If they've previously visited our 'back' page, then they're allowed
  // access, if they haven't then they're blocked.
  return session.visitedPages.includes(options.back);
};

/**
 * Render this page and send it to the user.
 *
 * @param {Request} request An express Request object.
 * @param {object} request.session The visitor's session.
 * @param {Response} response An express Response object.
 * @param {object} options An object containing this page's options.
 * @param {string} options.path The path to this page.
 * @param {string} [options.back] The path to the previous page.
 */
const renderPage = (request, response, options) => {
  if (guardAllows(request.session, options)) {
    saveVisitedPage(request.session, options.path);
    response.render(`${options.path}.njk`, {
      pathPrefix: config.pathPrefix,
      backUrl: options.back,
      model: request.session
    });
    return;
  }

  // Handle un-session-ed accesses to '/success' a little differently. The
  // user may have bookmarked this page, thinking they could see their
  // registration code again. Give them an error page that says otherwise.
  if (options.path === 'success') {
    response.status(403).render('error-success.njk', {pathPrefix: config.pathPrefix});
    return;
  }

  response.status(403).render('error.njk', {pathPrefix: config.pathPrefix});
};

/**
 * An enum that represents the possible states out of a page.
 */
const ReturnState = Object.freeze({
  Positive: 1,
  Negative: 2,
  Error: 3,
  Secondary: 4,
  SameAgain: 5
});

/**
 * A Router/Controller Factory returning an express Router based middleware that
 * can render pages, handle links and process per-page controllers.
 *
 * This allows use to configure our list of pages and their logic to be cleanly
 * specified in the application's main router.
 *
 * @param {object} options A 'POJsO' containing the page's configuration.
 * @param {string} options.path The path to this page.
 * @param {string} [options.back] The path to the previous page.
 * @param {string} [options.positiveForward] The path to the next page if the
 * controller's opinion is positive.
 * @param {string} [options.negativeForward] The path to the next page if the
 * controller's opinion is negative.
 * @param {string} [options.secondaryForward] The path to the secondary page if
 * the controller's opinion is appropriate.
 * @param {Function} [options.controller] The logic to process page requests and
 * decide what action to take next.
 *
 * @returns {express.Router} An express Router middleware.
 */
const Page = (options) => {
  const router = express.Router();

  router.get(`${config.pathPrefix}/${options.path}`, (request, response) => {
    // Render the page.
    renderPage(request, response, options);

    // If we've just rendered a success page...
    if (options.path === 'success' || options.path === 'other-success') {
      // Kill the user session, so they cannot re-submit.
      request.session.destroy();
    }
  });

  router.post(`${config.pathPrefix}/${options.path}`, async (request, response) => {
    let decision;
    try {
      decision = await options.controller(request, options);
      if (decision === ReturnState.Positive) {
        response.redirect(`${config.pathPrefix}/${options.positiveForward}`);
      } else if (decision === ReturnState.Negative) {
        response.redirect(`${config.pathPrefix}/${options.negativeForward}`);
      } else if (decision === ReturnState.Secondary) {
        response.redirect(`${config.pathPrefix}/${options.secondaryForward}`);
      } else {
        renderPage(request, response, options);
      }
    } catch (error) {
      console.log(error);
      response.status(500).render('error.njk', {pathPrefix: config.pathPrefix});
    }
  });

  return router;
};

export {Page, ReturnState};
