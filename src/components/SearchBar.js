import { makeStyles, IconButton } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(() => ({
  search: {
    width: "50%",
    margin: 'auto',
    borderRadius: 25,
    border: '2px solid #73AD21',
    padding: 10,
    outlineWidth: 0,
  },
}));

const SearchBar = () => {
  const classes = useStyles();
  return (
    <div>
      <form action="/" method="get">
        <input
          className={classes.search}
          type="text"
          id="header-search"
          placeholder="Search Manga"
          name="s"
        />
        <IconButton type="submit">
          <SearchIcon />
        </IconButton>
      </form>
    </div>
  );
};

export default SearchBar;
