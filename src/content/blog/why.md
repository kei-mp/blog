---
title: 'Why and How I Built This Blog'
description: 'And the why of the how'
pubDate: 'Feb 24 2025'
heroImage: '/blog-placeholder-3.jpg'
---

#### tldr;

- Astro: To generate the static site and convert markdown to html
- D3.js: For the post/tag force-directed graph
- Cloudflare Pages: To host and serve on its CDN
- GitHub Actions: To handle automatic integration and deployments

This is a very rough draft so if you're reading this bear with me, it's basically word vomit and will be cut down a lot. Some of what I write I don't actually believe (in the draft) - I'm just getting thoughts and ideas down. Want to document my thought process for how I go about using technology to solve problems. I can't remember who said it, but software is a very expensive way to solve a problem and I can attest to it after the last 3 years of leading the tech team at a rapidly growing international inspection company. Why do I say that? Well there's often much easier and cheaper solutions that require a change in process or paradigm. There are also a lot of competing incentives in the tech industry, and it's easy to get caught up in the latest trends and fads. Resume-driven development they call it, also the problem of the shiny new object syndrome. It's fun building new things, it's not fun picking the boring solutions. What most people miss is that it's even less fun maintaining a mess.

So let's start with why. I love building things, and I've never enjoyed writing for public, so a blog doesn't make much sense. Yet from my experience and what I can tell from my friends in the industry, there a lot of common problems that keep tripping up people. As I'm moving on from my current role, I've been thinking about how best can I help prevent from falling into the common traps. This blog is a hope to help me figure out how best to do that, and perhaps give some future insights to others.

Another why is that I'm interested in getting feedback for my ideas, I believe they're based on sound fundamentals but there could always be things I have missed or cases I have not thought of. It might be interesting to see the change over time of the different approaches.

Another reason is that since I always make the best decision for the business at my job, and often the correct answer is also the most boring, that means I only have personal projects to play around with new approaches, frameworks, ways of thinking.

Another reason is that technical blogs often miss the point, or are either too technical, or too abstract. For every 100 blogs there are about microservices for example, there are maybe 1 blog explaining how you probably don't need one. There should be more blogs from people in the trenches talking about things they've tried across all topics, from testing to project management, even UI/UX. Especially now with AI deleting the barrier to entry into software development, this will be more important since often people just want to have good enough defaults, not the thoeritically correct ideal. A side thought is that this is kind of like Scrum (and maybe Clean Architecture in the same vein), if you read the book you walk away convinced it's the key to success. It makes perfect sense. However try implement it in your team and see what happens to productivity (or even developer morale after sitting in meetings half the time). Scrum is also sold by the people who sell courses in it (same as DDD and probably Clean Architecture) - there are some perverse incentives here.

## How I Built This

### Why Astro?

I am especially wary of brand new javascript frameworks, but the idea behind Astro of Architecture Islands (check this I don't think it's 100% called that)