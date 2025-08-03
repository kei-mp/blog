---
title: 'Scraping LinkedIn Jobs with AI'
description: 'Using AI and web scraping to conduct a skills gap analysis for the defense industry'
pubDate: 'May 03 2025'
heroImage: '/job-scraping-ai.jfif'
---

I've been working in the oil & gas industry for the last 3 years, albeit more on the tech side which is more transferable. It's been a great challenge and learning experience but it was never meant to be forever and the major challenges have been solved. I've been looking to change industries for a while but am uncertain about what are the most important and sought-after skills.

I started looking at manufacturing/automation-related jobs that allow me to use my broad-ranging skillset in mechanical, electrical, and software. The tricky part is that sometimes the same roles can have different titles, or the same titles can have vastly different responsibilities. When thinking about my past experiences to tailor my resume, I wanted to leverage the most sought after skills. Would a hiring manager be impressed if I had essentially built an in-house ERP? Maybe. Would they be impressed about building a greenfield RFID tracking system? Almost definitely.

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

The job description is in a collapsed card with a title "About the job" with a `See more` link at the bottom. This appears to the same for all jobs. Now I need to figure out how to parse it.

Inspecting the collapse card shows, the following:

```html
<article class="jobs-description__container">
    <!-- All the job description details -->
</article>
```

So I can navigate to this page, copy this entire html element, and that should be good enough for the AI to parse and pull out the most relevant jobs. Come on LinkedIn, make it at least a little hard. Was initially expecting to have to simulate clicks to access the data but in hindsight that would have been a poor user experience if they data was fetched from the backend.

## The Implementation

Now before starting it's always good to take stock and reassess basic assumptions. In this case, the basic assumption was that it would be faster to write a script than to manually parse these job descriptions. After investigating the issue properly, we'll need to:

- Write a python script to access the jobs web page using selenium (20 mins)
- Write code to navigate to the each job post, and pull out the job description (10 mins)
- Send that job description html to an AI api with a prompt to return a list of skills. (30 mins)
- Write a way to aggregate the data (20 mins)

So let's say 1.5 hours to do this via scripting and AI. If we optimistically assume 2 minutes to do this manually for a job, it would be 6 hours. It's a no-brainer in the sense that if I tried to do this manually I would end up blowing my brains out.

## The code

The code for the script can be found here: [AI Job Scraping Script](https://github.com/kei-mp/ai-job-scraping)