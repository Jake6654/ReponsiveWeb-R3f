import { Box } from "@mui/material";
import "../css/domContents.css";
import Form from "./Form";

export default function Domcontents() {
  return (
    <div className="dom-contents-wrapper">
      <Box className="section-box-02">
        Creative Coding Lab 135.7 is a space where technology meets imagination.
        Through hands-on projects, students experiment with code as a medium for
        artistic expression, exploring generative visuals, interactive design,
        and digital storytelling.
        <br /> <br /> This lab fosters creativity, collaboration, and innovation
        at the intersection of art and computer science.
      </Box>
      <Box className="section-box-03">
        <Form />
      </Box>
    </div>
  );
}
