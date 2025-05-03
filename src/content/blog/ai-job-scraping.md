---
title: 'Scraping LinkedIn Jobs with AI'
description: 'Using AI and web scraping to conduct a skills gap analysis for the defense industry'
pubDate: 'May 03 2025'
heroImage: '/job-scraping-ai.jfif'
---

I've been working in the oil & gas industry for the last 3 years, albeit more on the tech side which is more transferable. It's been a great challenge and learning experience but it was never meant to be forever and the major challenges have been solved. I've been looking at getting into the defense industry for a while but am uncertain about what are the most important and sought-after skills.

I started looking at defense-related jobs that allow me to use my broad-ranging skillset in mechanical, software, and a lesser extent electrical engineering. If you search "defense" on LinkedIn, you get roles such as systems, product, program, solution, design, test, or RF engineers. Most of these roles would allow me to use the cross-disciplines skills I've gained; I definitely don't qualify for RF roles, that's pure electrical but it's something I've always found interesting after developing a RFID tracking system to install on offshore drillships.

After going through these jobs and saving the ones that sounded interesting, my plan was to read through them and pull out the relevant skills and start aggregating and tracking them by their frequency. At first the plan was to do this manually, however I had saved 170 jobs and [it then became quicker](https://xkcd.com/1205/) to automate this.

I've used a [javascript script](https://gist.github.com/matale/8b7c0fd8425c60ebe6db0c08bc82607b) on LinkedIn before that you run in your console browser, this was to go through and unsave all jobs because there's no way to do this in bulk. That wouldn't work since there are no standard formats for job descriptions and writing code to parse them would be very fickle, easier to download the job description, send it to an AI, and have it return skills in a set format that can then be parsed. Off the top of my head this would likely need a browser driver like selenium to navigate the website, a scripting language (likely python for it's AI libraries, especially pydandtic for response type checking, and then an AI api to send the job descriptions to.).

## The Investigation

### Navigating the saved jobs list

LinkedIn uses a search query param to track the page, based on the number of jobs: `https://www.linkedin.com/my-items/saved-jobs/?start=160` with 10 jobs shown per page.

Now I need to find if there's a way to programatically go through each post and navigate to it. Checking the page source, there's the following anchor tag for each title:

```html
<a class="nuXDIvMbeMYWApPugutCOKmVhZzvTYUM " href="https://www.linkedin.com/jobs/view/4216481674/?refId=957de8e7-2b89-4bd4-8699-a8f08e6d6485&amp;trackingId=2S5d%2FZcsTlme9WuofTKkWw%3D%3D&amp;trk=flagship3_job_home_savedjobs" data-test-app-aware-link="">
<!---->Product Engineer - Solidworks<!---->
</a>
```

I probably don't need all the referance and tracking IDs, if I try simply navigate to: `https://www.linkedin.com/jobs/view/4216481674/` does it work? Success. Yes it does.

### Parsing the job page