"use client";

import { use, useEffect } from "react";
import { elegant } from "@/components/text";
import { text } from "stream/consumers";

interface MorphingTextElements {
  text1: HTMLElement | null;
  text2: HTMLElement | null;
}

export default function TextHome() {
  useEffect(() => {
    const elts: MorphingTextElements = {
      text1: document.getElementById("text1"),
      text2: document.getElementById("text2"),
    };

    // The strings to morph between. You can change these to anything you want!
    const texts: string[] = ["Hi,", "I am", "Francesco", "Bruno", "Welcome"];

    // Controls the speed of morphing.
    const morphTime: number = 4;
    const cooldownTime: number = 4;

    let textIndex: number = texts.length - 1;
    let morph: number = 0.4;
    let cooldown: number = cooldownTime;

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;

      let fraction: number = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    }

    // A lot of the magic happens here, this is what applies the blur filter to the text.
    function setMorph(fraction: number) {
      if (elts.text2) {
        elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      }

      fraction = 1 - fraction;

      if (elts.text1) {
        elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      }

      if (elts.text1 && elts.text2) {
        elts.text1.textContent = texts[textIndex % texts.length];
        elts.text2.textContent = texts[(textIndex + 1) % texts.length];
      }
    }

    function doCooldown() {
      morph = 0;

      if (elts.text2) {
        elts.text2.style.filter = "";
        elts.text2.style.opacity = "100%";
      }

      if (elts.text1) {
        elts.text1.style.filter = "";
        elts.text1.style.opacity = "0%";
      }
    }

    window.addEventListener("scroll", startAnimation);

    function animate(cooldown: number) {
      requestAnimationFrame(animate);
      console.log(cooldown);
      if (cooldown <= 0) {
        doMorph();
      } else {
        doCooldown();
      }
    }

    function startAnimation() {
      const scrollPosition = window.scrollY * texts.length;
      let dt = Math.min(scrollPosition / window.innerHeight, 1) / texts.length;
      let integer = Math.floor(dt * texts.length);
      let durationCooldown = 1 / texts.length;
      let initialFraction = durationCooldown;
      let fractionScroll =
        initialFraction - (initialFraction / durationCooldown) * dt;
      let cooldown = initialFraction - (initialFraction - fractionScroll);

      if (elts.text1 && elts.text2) {
        elts.text1.textContent = texts[integer];
        elts.text2.textContent = texts[integer + 1];
      }

      animate(cooldown);
    }
  }, []);

  return (
    <div className="">
      <div className="h-screen grid content-end">
        <div
          id="container"
          className={"h-[80pt] " + elegant.className}
          style={{ filter: "url(#threshold) blur(0.6px)" }}
        >
          <span
            id="text1"
            className="absolute inline-block w-full text-center"
          ></span>
          <span
            id="text2"
            className="absolte inline-block w-full text-center"
          ></span>
        </div>

        <svg id="filters">
          <defs>
            <filter id="threshold">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}
