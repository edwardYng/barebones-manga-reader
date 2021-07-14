/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import {
  Button,
  ListItem,
  Card,
  CardContent,
  CardActions,
  ButtonBase,
  Typography,
  Grid,
  makeStyles,
  Collapse,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Loader from "./LoadScreen";

const myStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
  mangaCard: {
    width: 300,
  },
  cover: {
    height: "auto",
    width: "auto",
    maxWidth: 256,
  },
}));

const MangaSearchList = (props) => {
  const { mangaList } = props;
  const classes = myStyles();
  const [expanded, setExpanded] = useState(false);

  if (!mangaList) {
    return <Loader />;
  } else {
    return (
      <div style={{ justifyContent: "center" }}>
        {mangaList.map((manga) => {
          const handleExpandClick = () => {
            if (expanded) {
              setExpanded(false);
            } else {
              setExpanded(manga.data.id);
            }
          };

          const coverFileName = manga.relationships.find(
            (element) => element.type === "cover_art"
          );
          const cover = `https://uploads.mangadex.org/covers/${manga.data.id}/${coverFileName.attributes.fileName}`;
          const authorName = manga.relationships.find(
            (element) => element.type === "author"
          ).attributes.name;
          const artistName = manga.relationships.find(
            (element) => element.type === "artist"
          ).attributes.name;

          return (
            <ListItem key={manga.data.id} className="list" alignItems="center">
              <Card className={classes.root}>
                <Grid
                  container={true}
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <ButtonBase component={Link} to={"/manga/" + manga.data.id}>
                    <img src={cover} className={classes.cover} />
                  </ButtonBase>
                  <Grid item>
                    <Button
                      className="manga-text"
                      id={manga.data.id}
                      component={Link}
                      to={"/manga/" + manga.data.id}
                      style={{ textTransform: "none", padding: 0 }}
                    >
                      <CardContent className={classes.mangaCard}>
                        <Typography variant="h6">
                          {manga.data.attributes.title.en}
                        </Typography>
                      </CardContent>
                    </Button>
                    <CardContent className={classes.mangaCard}>
                      <Typography variant="body2">
                        Author: {authorName}
                        <br />
                        Artist: {artistName}
                      </Typography>
                      <Typography variant="body2">
                        {manga.data.attributes.lastChapter && (
                          <div>
                            Last Chapter: {manga.data.attributes.lastChapter}
                          </div>
                        )}
                      </Typography>
                      <Typography variant="body2">
                        {manga.data.attributes.lastVolume ? (
                          <div>
                            Last Volume: {manga.data.attributes.lastVolume}
                          </div>
                        ) : (
                          <br />
                        )}
                      </Typography>
                      <Typography variant="body2">
                        Created:{" "}
                        {new Date(
                          manga.data.attributes.createdAt
                        ).toDateString()}
                        <br />
                        Updated:{" "}
                        {new Date(
                          manga.data.attributes.updatedAt
                        ).toDateString()}
                      </Typography>
                      <CardActions>
                        <Button
                          onClick={handleExpandClick}
                          variant="outlined"
                          style={{ textTransform: "none" }}
                        >
                          {expanded === manga.data.id ? "Close" : "Show"}{" "}
                          Descripton
                        </Button>
                      </CardActions>
                      <Collapse
                        in={expanded === manga.data.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <CardContent>
                          <Typography variant="body2" component="p">
                            {
                              manga.data.attributes.description.en.split(
                                /\[.+?\]/
                              )[0]
                            }
                          </Typography>
                        </CardContent>
                      </Collapse>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </ListItem>
          );
        })}
      </div>
    );
  }
};

export default MangaSearchList;
