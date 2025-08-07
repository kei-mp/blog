---
title: 'How I Built this Website'
description: 'And why I have a lot of respect for frontend engineers'
pubDate: 'Mar 06 2025'
heroImage: '/website/island.jpg'
tags: ["#software"]
---

The island photo will make sense in a minute - I tried using a screenshot of this website but seeing a photo of a website on the same website looked weird.

I wanted to build a personal website as a way to showcase some of the personal projects I've been working on, and also to have a place to share thoughts into the void. Paul Graham has an excellent essay on how writing can hone your thinking: <a href="https://www.paulgraham.com/words.html" target="_blank">Putting Ideas into Words</a>.



Now there are many ways to build a website with varying levels of difficulty: easy using WordPress, moderate using just html, css, and javascript, and complex using a fullstack framework like Next.js. This is a bit of a joke, but considering maintenance, it's probably not wrong.

The way I built the website therefore had the following needs:

- Fun to build at first, but easy to maintain
- Have a node graph like <a href="https://obsidian.md/" target="_blank">Obsidian</a> or <a href="https://quartz.jzhao.xyz/" target="_blank">Quartz</a> because I found them interesting and thought it would look cool
- Be a tech stack I haven't used before (no ASP.NET or React)

I had seen hype around Astro.js as a static site generator. One of it's core features was an "Island Architecture" (hence the photo) where you could break up your webpages and have sections or "islands" of interactive components. This sounded perfect for the node graph.

![](/website/astro.jpg)

When you first scaffold an Astro.js web app, using the blog, you're greeting with the below screen. Behind the scenes, Astro.js takes markdown files that are stored in a `contents` folder and loads them as html pages.

![](/website/blog-template.png)

I then created a Vue.js component using the d3-force library to create the graph and added it to the front page only. You could navigate to posts by clicking the nodes, but with the texts the graph was a little overwhelming. Besides, since this website would be a sort of portfolio, it would help people being able to rather see the posts linked to specific topics such as "mechanical" or "software" engineering.

![](/website/old-graph.png)

But the concept was proven and enough to steam ahead. So I added my own layout and styling, along with darkmode to ease eyestrain when coding at night. I ran into issues with trying to save the state of the graph (i.e. the position and velocity of the nodes) so that it didn't reset when navigating between pages. This turned out to be surprisingly easy with a built-in Astro <a href="https://docs.astro.build/en/guides/view-transitions/" target="_blank">View Transitions</a> feature.



One challenge was how to get the Vue.js graph tied into Astro's view transitions. I couldn't find a direct way to call Astro functions from the graph, so instead a custom JavaScript event is launched from the graph that is handled by Astro:

```html
<script>
  import { navigate } from 'astro:transitions/client';

  window.addEventListener('astro:navigate', (event) => {
    const { url } = (event as CustomEvent).detail;
    if (url) {
      navigate(url);
    }
  });
</script>
```

Now the website is what you see today. Check out the source code here: <a href="https://github.com/kei-mp/blog" target="_blank">kei-mp/blog</a>

