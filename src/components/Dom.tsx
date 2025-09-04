import "../css/dom.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/src/all";
import { useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

export default function Dom() {
  useLayoutEffect(() => {
    gsap.timeline({
      // yes, we can add it to an entire timeline!
      scrollTrigger: {
        scroller: ".section-wrapper",
        trigger: ".section-02",
        start: "10% bottom",
        end: "bottom top",
        onEnter: () => {
          console.log("section-02 onEnter");
        },

        // pin: true, // pin the trigger element while active
        // start: "top top", // when the top of the trigger hits the top of the viewport
        // end: "+=500", // end after scrolling 500px beyond the start
        // scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
        // snap: {
        //   snapTo: "labels", // snap to the closest label in the timeline
        //   duration: { min: 0.2, max: 3 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
        //   delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
        //   ease: "power1.inOut", // the ease of the snap animation ("power3" by default)
      },
    });
  });

  return (
    <>
      <div className="dom-wrapper">
        <div className="section-wrapper">
          asdasdsadsa
          <div className="section-01"></div>
          <div className="section-02"></div>
          <div className="section-03"></div>
        </div>
      </div>
    </>
  );
}
