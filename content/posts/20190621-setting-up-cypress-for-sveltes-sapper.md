---
title: 'Setting Up Cypress for Svelte''s Sapper'
date: 2019-06-21T17:20:00.001-07:00
summary: A few weeks ago, I decided to try Svelte's Sapper framework to handle the front-end of a simple app...
categories:
  - Blog
  - Front-end
draft: false
---

A few weeks ago, I decided to try [Svelte](https://svelte.dev/)'s [Sapper framework](https://sapper.svelte.dev/) to handle the front-end of a simple app. I'm using this small project to try out some new technologies and to practice TDD/BDD. I had already built a back-end API in Go so just needed to build and wire-up a UI. I don't have a lot of experience in modern front-end tech or end-to-end testing, so I was excited to see that Sapper comes ready-to-use with the [Cypress test framework](https://www.cypress.io/). I was able to write some simple BDD(ish) tests to define the functionality I wanted and then implement in Svelte fairly seamlessly. Overall this was a natural and fluid flow, after overcoming a small gotcha.

### Cypress Tests Stall After Visiting New Pages

Most of my tests started with a cy.visit(url) to ensure a fresh page reload, but I quickly found that any click or DOM action within my Svelte components timed-out and failed sporadically, but frequently:  
CypressError: Timed out retrying: Expected to find \[...\]  
  
I believe this was due to the fact that Sapper does an excellent job of preloading and chunking out the app code and data asynchronously, so Cypress identified that the page was completely loaded and continued with the test script before all of the Sapper app chunks had actually been fully loaded.  
  
Initially, I solved this with a hacky cy.visit(url).wait(1000) that would wait for 1 second after the page loaded. Using wait() for something like this is pretty horrible practice, but it allowed me to continue development. But anyone who has worked with UI or E2E testing knows that one of the biggest issues is the time it takes to run them. Even with my little app only partially completed, testing time quickly ballooned out to over a minute to run all the tests due to the full second of wait time.  

#### Solution

My final solution uses Svelte's lifecycle functions to set a DOM attribute when all components are available. Use the onMount() function in the top-level routes/\_layout.svelte component, wait an additional tick() to ensure all child components had been loaded, then set an attribute in the DOM that Cypress can easily check:

<Code language="svelte">
{`
// File: src/routes/\_layout.svelte

<script>
	import Nav from '../components/Nav.svelte';
	import { onMount, tick } from 'svelte';

	export let segment;

	let testID = 'loading';
	onMount(() => {
		tick().then(() => {
			testID = 'loaded';
		});
	});
</script>

<style>
  ...
</style>

<Nav {segment}/>

<main data-test={testID}>
	<slot></slot>
</main>
`}
</Code>

In Cypress create a simple command called visitWait or similar that waits for the correct attribute value:  

<Code language="javascript">
{`
// File: cypress/support/commands.js

Cypress.Commands.add("visitWait", (url, options) => {
  cy.visit(url, options);
  cy.get('[data-test=loaded]');
});
`}
</Code>

In your tests, simply use cy.visitWait(url) as you would normally use cy.visit(url) and Cypress will wait just long enough for all the Svelte components to load before continuing with your test script.
