---
title: '(WIP) Back-EMF Balancer'
description: 'A remote-controlled mini 2-wheeled balancing robot using back-EMF for speed control'
pubDate: 'Aug 11 2025'
heroImage: '/blog-placeholder-2.jpg'
tags: ["#controls", "#elec"]
---

This is a project I originally started in college but ran out of time to work on it. It all started when the following video cropping up on my YouTube feed. It shoes a wirelessly controlled 2-wheeled balancing robot that uses back-EMF to predict the speed for speed control. This was appealing to me to tackle for multiple reasons:

- It's a problem that requires a deep level understanding of physics
- It's a fairly unique concept so no tutorials available online to copy
- I was originally in South Africa when I started it, and electronics such as encoders were rare and expensive

<iframe width="560" height="315" src="https://www.youtube.com/embed/4p-eRfBlrr8?si=A7v8JMyQU_ee2WmM&amp;start=10" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Reverse-Engineering

According to the video description, their solutions uses a dsPIC30F3013 processor connected to a 433MHz RF Module. The dsPICs are great for the control system since they have a single-cycle MAC to greatly speed up the error calculations, as well as PWM output for motor control.

They also use 30:1 micro metal gearbox motors to get the required torques. Doing a rough back-of-envelope calculation shows you need about 0.51 kg-cm of torque at most, which is just under the max recommended torques of these motors (you don't want to ever reach max torque i.e. stall the motor since the high current will damage them quickly).

Now the cool thing is that they use back-EMF for speed sensing and a PID for balancing and motor speed control. No need for an expensive encoder.

### What is Back-EMF?

To over-simplify things, electric motors and generators operate on the same physics principle - i.e. if you spin a motor you can generate power like a generator. Back-EMF is this produced power when you stop supplying electricity to a spinning motor. It's directly proportional to the speed the motor is spinning so is often used for motor speed control.

The graph below shows the Back EMF reading after a pulse from the motor driver, notice there is an initial inductive spike we'll need to account for when we measure the back-EMF. See Precision Microdrive's technical resource on <a href="https://www.precisionmicrodrives.com/ab-021" target="_blank">calculating RPM form Back-EMF</a> for further details.

![](/bemf/bemf-chart.png)

