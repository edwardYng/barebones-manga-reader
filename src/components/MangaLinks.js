import {
  Button,
  Icon,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import MyAnimeList_Logo from "./images/mal-logo.svg"
import AniList_Logo from "./images/al-logo.svg"


const MangaLinks = (linksprops) => {
  const links = linksprops.links;
  const mal = Object.keys(links).find((key) => key === "mal");
  const al = Object.keys(links).find((key) => key === "al");
  const malIcon = (
    <Icon>
        <img alt="mal" src={MyAnimeList_Logo} />
    </Icon>
  );
  const alIcon = (
    <Icon>
        <img alt="al" src={AniList_Logo} />
    </Icon>
  );

  return (
    <div>
    {(mal || al) && (
        <Typography variant="body2">
            <b>Links</b>
        </Typography>
    )}
      {mal && (
        <Button
          component={Link}
          to={{ pathname: `https://myanimelist.net/manga/${links.mal}` }}
          style={{ textTransform: "none", padding: 3 }}
          size="small"
          startIcon={malIcon}
        >
          MyAnimeList
        </Button>
      )}
      <br />
      {al && (
        <Button
          component={Link}
          to={{ pathname: `https://anilist.co/manga/${links.al}` }}
          style={{ textTransform: "none", padding: 3 }}
          size="small"
          startIcon={alIcon}
        >
          <img src="images/MyAnimeList_Logo.png" alt="" />
          AniList
        </Button>
      )}
    </div>
  );
};

export default MangaLinks;
