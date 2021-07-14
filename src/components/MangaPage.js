/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { useParams, Link } from "react-router-dom";
import FetchChapterList from "./getChapters";
import GetManga from "./getManga";
import {
  makeStyles,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Button,
} from "@material-ui/core";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Loader from "./LoadScreen";
import ChapterList from "./ChapterList";
import useWindowDimensions from "./useWindowDimensions";
import MangaLinks from "./MangaLinks";

const myStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
  mangaCard: {
    minWidth: 300,
  },
  cover: {
    height: "auto",
    width: "auto",
    maxWidth: 512,
  },
}));

const MangaCard = () => {
  const { id } = useParams();
  const classes = myStyles();
  const { width } = useWindowDimensions();

  const {
    isLoading: mangaLoading,
    error: mangaError,
    mangaInfo,
  } = GetManga(id);

  if (mangaLoading) {
    return <Loader />;
  } else if (mangaError) {
    return <div>ERROR Loading Manga</div>;
  } else {
    return (
      <Container maxWidth="md" justify="center">
        <Card className={classes.root}>
          {width > 700 && (
            <CardMedia>
              <img
                src={`https://uploads.mangadex.org/covers/${id}/${mangaInfo.coverFileName}`}
                className={classes.cover}
              />
            </CardMedia>
          )}
          <CardContent className={classes.mangaCard}>
            <Typography variant="h4">{mangaInfo.title}</Typography>
            <br />
            <Divider />
            <br />
            <Typography variant="body2">
              <b>Description</b>
              <br />
              {mangaInfo.description}
            </Typography>
            <br />
            <Divider />
            <br />
            <Typography variant="body2">
              Author: {mangaInfo.author}
              <br />
              Artist: {mangaInfo.artist}
            </Typography>
            <br />
            <Divider />
            <br />
            <MangaLinks links={mangaInfo.links} />
          </CardContent>
        </Card>
      </Container>
    );
  }
};

const MangaPage = () => {
  const { id } = useParams();
  const {
    isLoading: chaptersLoading,
    error: chaptersError,
    chapters,
  } = FetchChapterList(id, "en", 0, 500);
  const {
    mangaInfo,
  } = GetManga(id);

  if (chaptersLoading) {
    return <Loader />;
  } else if (chaptersError) {
    return <div>ERROR</div>;
  } else {
    return (
      <div className="mangapage">
        <div className="container">
          <br />
          <Button
            component={Link}
            to={`/?s=${mangaInfo.title}`}
            style={{
              flexGrow: 1,
              marginLeft: 24,
              textSizeLarge: true,
            }}
            startIcon={<ArrowBackIosIcon />}
            variant="outlined"
          >
            <Typography variant="subtitle1">Back to Search</Typography>
          </Button>
          <br />
          <br />
          <MangaCard />
          <br />
          <ChapterList chapters={chapters} />
        </div>
      </div>
    );
  }
};

export default MangaPage;
