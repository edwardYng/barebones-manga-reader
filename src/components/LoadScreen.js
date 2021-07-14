import { Backdrop, CircularProgress } from "@material-ui/core";

const Loader = () => {
  return (
    <Backdrop open={true}>
      <CircularProgress color="secondary" size={200} thickness={5} />
    </Backdrop>
  );
};

export default Loader;
