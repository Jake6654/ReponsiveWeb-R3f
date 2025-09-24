import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/src/all";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { StepState } from "../common/interface";
import { atomCrntStep, atomCrntScrollY } from "../atoms/atoms";
import { setScrollTop, stepToString } from "../common/utils";
import { Box, Typography } from "@mui/material";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

export default function Dom(props: any) {
  const sectionWrapRef = useRef<HTMLDivElement>(null);
  const [crntStep, setCrntStep] = useRecoilState<StepState>(atomCrntStep);
  const [crnScrollY] = useRecoilState<StepState>(atomCrntScrollY);
  const isDebug = props.isDebug;

  useEffect(() => {
    if (sectionWrapRef.current) {
      sectionWrapRef.current.scrollTop = crnScrollY;
      setScrollTop(sectionWrapRef.current.scrollTop);
    }
  }, [crnScrollY]);

  useLayoutEffect(() => {
    gsap.timeline({
      scrollTrigger: {
        scroller: ".section-wrapper",
        trigger: ".section-01",
        start: "0% 0%",
        end: "100% 20%",
        onEnter: () => {
          console.log("section-01 onEnter");
          if (crntStep !== StepState.STEP_1) {
            setCrntStep(StepState.STEP_1);
          }
        },
        onEnterBack: () => {
          console.log("section-01 onEnterBack");
          if (crntStep !== StepState.STEP_1_AND_2) {
            setCrntStep(StepState.STEP_1_AND_2);
            gsap.to(".section-box-02", { right: "-100%", duration: 0.5 });
          }
        },
        onLeave: () => {
          console.log("section-01 onLeave");
          if (crntStep !== StepState.STEP_1_AND_2) {
            setCrntStep(StepState.STEP_1_AND_2);
          }
        },
        onLeaveBack: () => {
          console.log("section-01 onLeaveBack");
          if (crntStep !== StepState.STEP_1) {
            setCrntStep(StepState.STEP_1);
          }
        },
      },
    });

    gsap.timeline({
      // yes, we can add it to an entire timeline!
      scrollTrigger: {
        scroller: ".section-wrapper",
        trigger: ".section-02",
        start: "0% 0%",
        end: "100% 20%",
        onEnter: () => {
          console.log("section-02 onEnter");
          if (crntStep !== StepState.STEP_2) {
            setCrntStep(StepState.STEP_2);
            // I used gsap to trigger a specific action at a certain step
            gsap.to(".section-box-02", { right: "10%", duration: 0.5 });
          }
        },
        onEnterBack: () => {
          console.log("section-02 onEnterBack");
          if (crntStep !== StepState.STEP_2) {
            setCrntStep(StepState.STEP_2);
            gsap.to(".section-box-02", { right: "10%", duration: 0.5 });
            gsap.to(".section-box-03", { opacity: 0.0, duration: 1 });
            gsap.to(".section-box-03", { left: "200%", duration: 0.0 });
          }
        },
        onLeave: () => {
          console.log("section-02 onLeave");
          if (crntStep !== StepState.STEP_3) {
            setCrntStep(StepState.STEP_3);
            gsap.to(".section-box-02", { right: "100%", duration: 0.5 });
            gsap.to(".section-box-03", { opacity: 1.0, duration: 1 });
            gsap.to(".section-box-03", { left: "50%", duration: 0.0 });
          }
        },
        onLeaveBack: () => {
          console.log("section-02 onLeaveBack");
          if (crntStep !== StepState.STEP_1_AND_2) {
            setCrntStep(StepState.STEP_1_AND_2);
          }
        },
      },
    });
  }, []);

  return (
    <>
      <div className="dom-wrapper">
        <div className="step-display">{stepToString(crntStep)}</div>
        <div className="section-wrapper" ref={sectionWrapRef}>
          <div className="section-01">
            <Box className="section-box-01">
              <p className="typography-01">Creative Coding Lab 137.5</p>
              <p className="typography-02">
                Exploring the intersection of Art and Technology
              </p>
            </Box>
          </div>
          <div className="section-02"></div>
          <div className="section-03"></div>
        </div>
      </div>
    </>
  );
}
