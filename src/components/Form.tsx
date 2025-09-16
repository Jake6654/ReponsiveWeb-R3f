import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function Form() {
  return (
    <Grid
      container
      spacing={3}
      style={{
        width: "80%",
        margin: "0 auto",
        padding: "20px 10px",
        backgroundColor: "#rgba(0,0,0,0)",
        maxWidth: "1536px",
      }}
    >
      <FormGrid size={{ xs: 12, md: 6 }}>
        <InputLabel>First Name</InputLabel>
        <TextField id="first-name" rows={4} placeholder="TaeJae(Jay)" />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <InputLabel>Last Name</InputLabel>
        <TextField id="last-name" rows={4} placeholder="Han" />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <InputLabel>Email</InputLabel>
        <TextField id="email" rows={4} placeholder="137.5lab@gmail.com" />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <InputLabel>Title</InputLabel>
        <TextField
          id="ftitle"
          rows={4}
          placeholder="Inquiry for Coding Lab 137.5"
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <InputLabel>Message</InputLabel>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={4}
          placeholder="I hope this message finds you well. I am reaching out to inquire about your latest projects and potential collaboration opportunities. Please let me know how we can connect further."
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 8 }}>
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Agree to receiving information and survey of the future event."
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 2 }}></FormGrid>
      <FormGrid size={{ xs: 12, md: 2 }}>
        <Button variant="contained" style={{ maxWidth: "100px" }}>
          Submit
        </Button>
      </FormGrid>
    </Grid>
  );
}
