/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';

const styles = () => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
});

class AddDialog extends Component {
  render() {
    const {
      classes,
      dialogOpen,
      onOpen,
      onClose,
      onTransition,
      onAdd,
    } = this.props;
    return (
      <Dialog
        fullScreen
        open={dialogOpen}
        onClose={onClose}
        transition={onTransition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Add Credit Card
            </Typography>
            <Button color="inherit" onClick={onAdd}>
              save
            </Button>
            <IconButton color="inherit" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {/* Form here... */}
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddDialog);
