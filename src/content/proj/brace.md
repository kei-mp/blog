---
title: '3D Printed Handbrace'
description: 'Because I kept loosen them in the surf'
pubDate: 'Apr 03 2019'
heroImage: '/brace/brace1.png'
tags: ["#mech", "#cad", "#3d-print"]
---

When I was 16 I got nerve damage in my left hand, losing a bit of feeling in my pinky. Not the end of the world but I had to be careful - I went snowboarding once and was struggling to pull on my left glove until I realized my pinky was not in the finger properly and was being bent backwards. To help with that and general rehab, the physios made a brace to support my hand. The only issue was that it looked like a pair of knuckle-dusters, and I kept losing it when surfing. So I decided to model one that could be easily 3D printed.

Here's a photo of what it looked like before. Ignore the monkey like that selective attention test video, the one with the balls and the gorilla costume.

![](/brace/monkey.jpg)

Back in 2019 when I made the brace, you couldn't download 3D scanning apps like today. So to model the brace dimensions I took photos at different angles and sketched the dimensions in different planes using Fusion360.

![](/brace/pictures.png)

Once I had the sketches on the planes, it was easy enough to create the model. To create the correct curved surface dimensions, I first modeled the outline of the brace at different levels and then joined them using lofted features.

![](/brace/lofted.png)

This design had the same dimensions of the physio-made brace, but the sharp slope for the finger support meant that it would dig in when the hand is flat for example when doing push-ups. The lofted base also just didn't look nice - a big point of 3D printing the base was to make it look less like a weapon.

Using a spline instead allowed a much more flexible design and future alterations. The first iteration was too tight around my knuckles, the second iteration was good enough to use. I went with ABS plastic since it's generally stronger and less lightly to deform if left in a hot car, however it's worth exploring other material types that are more flexible.

![](/brace/prints.jpg)

I don't really wear my brace anymore but future improvements I would like to do is redesign it so that it only covers/supports the pinky, as well as use topology optimization to allow it to breathe better.

## 3D Model

<iframe width="100%" height="300" style="border:1px solid #eeeeee;" src="https://3dviewer.net/embed.html#model=https://raw.githubusercontent.com/kei-mp/blog/master/public/brace/handbrace.stl$camera=-21.28106,97.72603,118.24280,42.63206,12.50854,-9.58343,0.00000,1.00000,0.00000,45.00000$projectionmode=perspective$envsettings=fishermans_bastion,off$backgroundcolor=255,255,255,255$defaultcolor=200,200,200$defaultlinecolor=100,100,100$edgesettings=off,0,0,0,1"></iframe>