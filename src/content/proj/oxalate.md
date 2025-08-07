---
title: 'Oxalate Database'
description: 'Web app to lookup the amount of oxalates in common foods'
pubDate: 'Feb 08 2021'
heroImage: '/oxalate.png'
tags: ["#software"]
---

This was the first web app I ever built, using Django and Python.

During my final year mechanical engineering exams at UCT, I drank way too much coffee and too little water. To counteract this unhealthy lifestyle, I made a lot of green smoothies, not realizing that these were rich in things called oxalates, and that these can cause kidneys stones if dehydrated for long periods.

To prevent it from happening again, the doctors put me on a low-oxalate diet to the dismay of my mom and girlfriend. Now if I was ever a dinner guest, they'd had to print lists of high-oxalate foods and cross-reference it with their recipe.

It was a nightmare.

So I build this web app to have an online database of common foods that could be looked up, with a simple green/yellow/red indicator for meals and ingredients. There were existing apps out there, but these didn't break down meals into the individual ingredients (to see if something could be removed or replaced).

The other issue is that different studies and sources can have widely varying results. I remember instant coffee for example was supposedly one of the main culprits, but it was because the scientist used a full cup of instant coffee powder instead of a normal-sized teaspoon serving. So this app also had every value linked to a source so that users could query or request to update values based on new information.

Check out the source code here: <a href="https://github.com/kei-mp/oxalate" target="_blank">kei-mp/oxalate</a>
