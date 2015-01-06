---
layout: default
title: Crystal.js
description: Pure Javascript Inline Form Validation
keywords: form validation, crystal.js
---

<section class="demo1">
	<div class="row" id="demo1">
		<div class="large-12 columns">
			<h1 class="mvl"><a target="_blank" href="https://github.com/cojomojo/crystal.js">Crystal.js</a>, pure Javascript inline form validation.</h1>
			<h4 class="center"><i>Fill out the form and see the awesome!</i></h4>
			<div id="sent" class="alert-box success radius" data-alert="">Message Sent.</div>
			<div id="not-valid" class="alert-box alert radius" data-alert="">Invalid field input.</div>
			<form action="" id="demo1-form">
				<div class="row">
					<div class="large-6 small-12 columns">
						<label>Name</label>
						<input data-crystal="name" type="text" id="name">
					</div>
					<div class="large-6 small-12 columns">
						<label>Email</label>
						<input data-crystal="email" type="text">
					</div>
				</div>
				<div class="row">
					<div class="large-6 small-12 columns">
						<label>Company</label>
						<input type="text">
					</div>
					<div class="large-6 small-12 columns">
						<label>Phone</label>
						<input type="text">
					</div>
				</div>
				<div class="row">
					<div class="large-12 columns">
						<label>Message</label>
						<textarea class="message" type="text" data-crystal="message"></textarea>
					</div>
				</div>
				<div class="row">
					<div class="large-12 columns"><input type="submit" class="submit button"></div>
				</div>
			</form>
		</div>
	</div>
</section>
<section class="why">
	<div class="row">
		<a id="why"></a>
		<h2>Why</h2>
		<p class="explain">
			Basic HTML forms are ugly, and quite frankly, are hated by users. However, forms are important. They are a key point of interaction between users, and you. Heck, forms may even be the entire point of your web site (well succesfully making conversions to be specific). Therefore, web designers must creatively turn ugly, hated forms, into beautiful, user-friendly, forms in order to increase conversion rates. One great way of doing this is inline form validation. <i>Users love seeing feedback as they fill out a form.</i> Crystal.js aims to make inline form validation easier to implement.
		</p>
	</div>
</section>
<section class="updates">
	<a id="updates"></a>
	<div class="row">
		<h2> Now including...</h2>
		<div id="multi-form-support">
			<h4>Multiple form support!</h4>
			<p> 
				The latest and greatest version of Crystal.js includes support for multiple forms on a single page.
			</p>
			<form action="" id="demo2">
				<p> My name is <input class="inline" data-crystal="name"> and I am contacting you about <input class="inline" data-crystal="message">.
				The best email to contact me is <input class="inline" data-crystal="email">.
				</p>
			</form>
		</div>
		<div id="event-emitter">
			<h4> Event emitter! </h4>
			<p>
				Crystal.js no longer handles submitting of forms, but instead uses an event emitter, to indicate if all field of a form are valid or invalid when submit has been clicked. 
			</p>
		</div>
	</div>
</section>
<section class="future">
	<a id="future"></a>
	<div class="row">
		<h2> Future Features</h2>
		<div class="database-interactions">
			<h4> Database Interactions</h4>
			<p> In the future Crystal.js will have support for interacting with databases asynchronously. This will allow for validation rules that can check against data from a database. 
			</p>
		</div>
	</div>
</section>
<section class="docs">
	<a id="docs"></a>
	<div class="row">
		<div class="docs large-12 columns">
			<a href="tutorial" class="button large-6 columns full-width">Tutorial</a>
			<a href="https://github.com/cojomojo/crystal.js/wiki" class="button large-6 columns full-width">Wiki/Detailed Docs</a>
			<a href="https://github.com/cojomojo/crystal.js/" class="button large-6 columns full-width">Download on GitHub</a>
		</div>
</section>