/*
 * Crystal.js
 * https://github.com/cojomojo/crystal.js
 *
 * Copyright (c) 2015 Cody Balos
 * Licensed under the MIT license.
 */

function crystalTest() {
	var testCrystal = new Crystal();

	test("Crystal object created successfully.", function() {
		ok(typeof testCrystal === "object", "Crystal constructed.");
	});

	test("Crystal methods all work.", function() {
		testCrystal.popCrystalForm();
	});
}