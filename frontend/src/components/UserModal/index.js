import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  InputAdornment,
  IconButton
} from "@material-ui/core";

import { Visibility, VisibilityOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import useWhatsApps from "../../hooks/useWhatsApps";

const ImageUpload = ({ userImage, setUserImage, preview, setPreview, error, setError }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 2MB.");
        return;
      }
      setError(null);
      setUserImage(file);

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  multFieldLine: {
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const UserModal = ({ open, onClose, userId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    email: "",
    password: "",
    profile: "user"
  };

  const { user: loggedInUser } = useContext(AuthContext);

  const [user, setUser] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [whatsappId, setWhatsappId] = useState(false);
  const { loading, whatsApps } = useWhatsApps();

  const [userImage, setUserImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const { data } = await api.get(`/users/${userId}`);
        setUser(prevState => ({ ...prevState, ...data }));
        setSelectedQueueIds(data.queues?.map(queue => queue.id));
        setWhatsappId(data.whatsappId ? data.whatsappId : "");
      } catch (err) {
        toast.error("Erro ao carregar dados do usuário");
      }
    };
    fetchUser();
  }, [userId]);

  const handleClose = () => {
    onClose();
    setUser(initialState);
    setUserImage(null);
    setPreview(null);
    setError(null);
  };

  const handleSaveUser = async (values) => {
    const userData = {
      ...values,
      whatsappId,
      queueIds: selectedQueueIds,
      image: userImage,
    };
    try {
      if (userId) {
        await api.put(`/users/${userId}`, userData);
      } else {
        await api.post("/users", userData);
      }
      toast.success("Usuário salvo com sucesso!");
      handleClose();
    } catch (err) {
      toast.error("Erro ao salvar usuário");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth scroll="paper">
      <DialogTitle id="form-dialog-title">
        {userId ? i18n.t("userModal.title.edit") : i18n.t("userModal.title.add")}
      </DialogTitle>
      <Formik
        initialValues={user}
        enableReinitialize={true}
        validationSchema={UserSchema}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            handleSaveUser(values);
            actions.setSubmitting(false);
          }, 400);
        }}
      >
        {({ touched, errors }) => (
          <Form>
            <DialogContent dividers>
              <ImageUpload 
                userImage={userImage}
                setUserImage={setUserImage}
                preview={preview}
                setPreview={setPreview}
                error={error}
                setError={setError}
              />
              <Field
                as={TextField}
                label={i18n.t("userModal.form.name")}
                autoFocus
                name="name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <Field
                as={TextField}
                label={i18n.t("userModal.form.email")}
                name="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                {i18n.t("userModal.buttons.cancel")}
              </Button>
              <Button type="submit" color="primary" className={classes.btnWrapper}>
                {userId ? i18n.t("userModal.buttons.okEdit") : i18n.t("userModal.buttons.okAdd")}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default UserModal;
