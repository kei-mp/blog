---
title: 'Quality as Code'
description: 'Why you should manage your procedures like software'
pubDate: 'Jul 30 2025'
---

There's been increasing trends towards getting more of IT stack checked into source control. You've heard of infrastructure as code, documentation as code - now let me propose quality as code.

By quality, I'm referring to the written processes and procedures that companies driving towards an ISO9001 audit throw into the back seat. It's messy in there, and we'll dig through why asking your intern to clean it up is as obnoxious an idea as asking them to clean up your car's back seat.

First it's important to point out that the quality officer, unlike policemen, has already been paid off by your company. ISO9001 can be seen like a period scheme in this regard.[^1] So no need to keep all that paperwork in your car. In reality you probably need a lot less and besides, getting people to even read and follow procedures is tough enough.

If any of the above sounds like your current company then keep reading on, otherwise get back to creating shareholder value.

What makes me qualified to talk about this? I've worked in various industries and sizes of companies, and recently spent 3 years building up an in-house software product and seeing it through ISO9001 and DNV-CP-0635 audits. Writing good, fit-for-purpose software quickly is hard. Taking it through audit approvals is another monster. And that's ultimately why I'm proposing this case - as a pragmatic way to work better that I believe most people are missing.

With software version control, changes are tracked line by line with a complete history of who changed what. Wondering who put added that obscure requirement? The one that doesn't make sense and requires you to jump through two more hoops? Software version control aplty has a feature called 'blame' that lists wrote it and when. If you use a software management system like GitHub, then you could even be linked to who approved the change and see any discussions on it.

That's the other feature that's built into cheap and easy-to-use software management platforms - a very simple review,  approval, and ownership model that your quality team will hate how easy it is to use, since they'll lose the job security of being the only ones that know how to navigate the mazes they made.

Finally things ISO9001 require updates to procedures to notify relevant parties. I've been in companies where any update to any procedure is emailed to every person in the company. The signal-to-noise ratio is basically zero. It gets worse; the emails don't even tell you what changed - only that some words somewhere in the document may or may not have been added to appease an auditor.

Treating things like documentation as a first-class citizen, as important as source core itself, has a lot of benefits. There may be quality management systems out there that do what I'm proposing, but I'm sure they're expensive and you don't really want your company's intellectual property in someone else's hands.

The one catch is that if this were to be implemented, then subject matter experts would need to become competent using basic features of git and GitHub and even though I'm optimistic this could be done, I've seen how difficult it is to shift culture and longstanding ways of doing things. You'd have an easier time getting everyone to write procedures in excel.

The above only gets you halfway there. You can take a workhorse to a library but you can't make it read. Maybe unlike horses, people want to work well and be good at their jobs. Daniel Pink wrote a great book about it called [Drive](https://www.danpink.com/books/drive/).

To help address this issue, I thought it would be cool to combine notes and a way for users to test themselves with flashcards. Kind of how RemNote does it. I've created [a basic prototype of how the UX would work](https://kei-mp.github.io/memnote/). The idea being people can gauge how well they know critical details using spaced repetition. You could also give HR access to the stats. This could replace a large part of company training platforms that get handed off to that poor intern cleaning your cars backseat, that just duplicate information (a big nono in software development) and create stupid questions that test the procedure and not the actual process. 

[^1]: This is explained well in the book [Surviving ISO 9001](https://www.survivingiso9001.com/), that I recommend anyone dealing with ISO9001 read - even more so than the actual spec.