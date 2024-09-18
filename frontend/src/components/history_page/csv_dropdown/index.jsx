import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import "./index.css"

export default function CsvDropDown({ contents }) {
  const [open, setOpen] = React.useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button
        onClick={handleClickOpen}
        sx={{ border: "1px solid white", padding: "5px 20px" }}
      >
        <div className="header">
          <span>SEE CSV CONTENT</span>
        </div>
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText sx={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px 50px'}}>
            {contents.map((content, index) => (
              <>
                <code key={index}>
                  {index + 1}. {content.format}
                </code>
        
              </>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            sx={{
              color: "black",
              border: "1px solid gray",
              fontSize: "12px",
              padding: "2px 3px",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
