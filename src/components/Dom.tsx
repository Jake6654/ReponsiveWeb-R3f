import "../css/dom.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/src/all";
import { useLayoutEffect } from "react";
import { useRecoilState } from "recoil";
import { StepState } from "../common/interface";
import { atomCrntStep } from "../atoms/atoms";
import { stepToString } from "../common/utils";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

export default function Dom() {
  const [crntStep, setCrntStep] = useRecoilState<StepState>(atomCrntStep);

  console.log("crntStep: ", stepToString(crntStep));

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
        end: "100% 0%",
        onEnter: () => {
          console.log("section-02 onEnter");
          if (crntStep !== StepState.STEP_2) {
            setCrntStep(StepState.STEP_2);
          }
        },
        onEnterBack: () => {
          console.log("section-02 onEnterBack");
          if (crntStep !== StepState.STEP_2) {
            setCrntStep(StepState.STEP_2);
          }
        },
        onLeave: () => {
          console.log("section-02 onLeave");
          if (crntStep !== StepState.STEP_3) {
            setCrntStep(StepState.STEP_3);
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
        <div className="section-wrapper">
          <div className="section-01"></div>
          <div className="section-02"></div>
          <div className="section-03"></div>
        </div>
      </div>
    </>
  );
}
