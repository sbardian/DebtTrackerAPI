import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import AdminUsers from '../components/AdminUsers';
import EditUserDialog from '../components/EditUserDialog';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  loading: {
    textAlign: 'center',
    fontSize: '48pt',
  },
  flex: {
    flex: 1,
  },
  chart: {
    background: '#fff',
  },
});

const AdminDashboard = ({ classes, history, showAlert }) => {
  const [showEditUserDialog, setShowEditUserDialog] = React.useState(false);

  const handleToggleEditUserDialog = () => {
    setShowEditUserDialog(!showEditUserDialog);
  };

  return (
    <div>
      <AdminUsers showAlert={showAlert} />
      <EditUserDialog
        user={{ username: 'test' }}
        toggleDialog={handleToggleEditUserDialog}
        // onTransition={DialogTransition}
        dialogOpen={showEditUserDialog}
        // onSave={onSave}
        // onRequired={handleRequired}
        // cardToEdit={cardToEdit}
        // title={dialogTitle}
        // username={username}
      />
    </div>
  );
};

AdminDashboard.defaultProps = {
  // TODO
};

AdminDashboard.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  classes: PropTypes.shape().isRequired,
  showAlert: PropTypes.func.isRequired,
};

export default withTheme()(withRouter(withStyles(styles)(AdminDashboard)));
