---
title: 'Mechanical UT Scanner'
description: 'Building a mechanically-actuated wall-thickness scanning inline robotic tool, and why it''s not a good idea'
pubDate: 'Jul 30 2025'
heroImage: '/digraph.png'
---

When I was busy looking for work in the USA after building a software and mechatronics in Cape Town for the passed 3 years, I didn't have much of a mechanical-engineering oriented portfolio to show during potential interviews. The reality was that most of my free time was spent upskilling in software and architecture design and mechatronics and boring stuff like ISO 9001 audits.

I've spent a large part of my career building and thinking about how to improve in-line inspection robotic tools. Like the difficulty of that quickly five times, there a lot of interesting and difficult challenges that these tools introduce. For one, there is constant competing real estate for the central axis between the centralizing, rotation, and transport (in terms of fuilds and electronics) mechanisms.

This request came at a time when I had been entertaining the idea that you could explot the relationship between the axial movement of the tool through the pipe, and turn it into rotational mvoement of ultrasonic probes to scan the pipe. It's an interesting idea that becomes unstuck quickly: you have rotating probes that require a water and electrical supply, but you also need a way to track the position of the tool in the pipe with some sort of electrics. This means that you'd need a hybrid rotary union of high-frequency electrical connections and water supply, which they don't sell at Walmart so you'd be looking at expensive custom solutions - defeating the purpose of removing the electrical motor to simplify and cheapen the tool. But that's what makes this a great project to choose, since there's no risk of me leaking company IP, and would allow me to expose my thoughts, reasonings, and mistakes to the hiring manager.

Considering this, I wanted to give myself a week (evenings & weekends only) to complete this project since that's all long as I was willing to commit of my free time to this. So let's decide some project specifications so we can determine if ultimately it is a success or failure.

Project goals:

- Figure out if we can use the travel to spin the probe axis

Scope:

- Focus on the mechanical design in detail, make sure it's possible to manufacture and assembly (cheaply and easily)
- Will ignore vibrations and things like variation in the pipe ID (since these are relatively easy to consider later)

Contraints:

- Can we do it in one week.

Project specifications:

- The pipe to scan is carbon steel
- Needs to scan 100% of wall thickness surface area (since that's where the O&G industry is moving towards)
- The pipe diameter does not change and is known beforehand
- Needs to be cheap and easy to make
- Needs to be light enough for a person to carry (<45 lbs)
- Needs to be easy to repair or replace broken components
- Needs to operate in harsh conditions

Considering these above goals, specifications, and constraints, our approach is important so we focus on making progress and don't get stuck into analysis paralysis. Especially considering that the general idea is bad, there will be a lot of choices between bad and worse decisions, but it's important to push ahead so we can iterate quickly.

After reviewing existing designs and seeing if there are any ideas we can /steal/ reverse-engineer, we can begin some initial sketches. There basically are 2 ways to centralize the tool: 

- We can force the wheels outwards
- We can have the main body of the tool sit low and have a raised axis to centralize the probes

Keeping the main thing, the rotation mechanism, in mind - it's inherently more diffcult to implement a solution that uses centralizing legs since these legs are not fixed and therefore any transfer of power would be complicated. Considering you'd want some sort of magnetic wheel to increase the normal force and reduce chance of slippage, I went ahead with the crawler design. This feels like the right idea since we won't need all the extra weight of centralizing leg linkages. After iterating mechanisms, the below one was the first one I was marginally happy with. We're under the gun so let's push ahead and, as the youths say, mess around and find out.

## Starting the CAD Modeling

Because we're in such an early design phase, we're going to use a top-down modeling method, specifically using a "Master Model" that we can derive assemblies and parts from so that it's easier to make sweeting changes and move things around. Interestingly enough this reminded be a lot of moving software around between classes. It's always great to find links between different discliplines (like how fluid pressure is a great metaphor for electrical voltage). Although with software it's much easier to move code around - the compiler will warn you of any mistakes and they can usually be fixed in a couple of clicks. SolidWorks however is like an old stubborn grandpa with Alzeimers, who after telling him you're going to move the TV remote out of the kitchen utensil drawer, he'll forget and have a fit when he can no longer find it.

[images of solidworks error]

After modeling the ba