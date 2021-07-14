import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  ListItem,
  makeStyles,
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Typography,
  Container,
  Paper,
  ListItemText,
  Grid,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import moment from "moment";

const myStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
  chapterItem: {
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
  },
  mangaCard: {
    minWidth: 300,
  },
  chapterButton: {
    textTransform: "none",
  },
}));

const ChapterDatatoInfo = (props) => {
  const { chapter } = props;
  const classes = myStyles();

  return (
    <Paper className={classes.chapterItem}>
      <Typography variant="subtitle1">
        {`Chapter ${chapter.chapter} ${chapter.title}`}
      </Typography>
      <Grid container spacing={1}>
        <ListItemText
          secondaryTypographyProps={{ align: "left", variant: "caption" }}
          secondary={moment(chapter.timestamp * 1000).format("LL")}
        />
        <Typography variant="caption" color="textSecondary">
          {Object.values(chapter.groups).join(", ")}
        </Typography>
      </Grid>
    </Paper>
  );
};

const ChapterList = (props) => {
  const { chapters } = props;
  const classes = myStyles();
  const [isDesc, setIsDesc] = useState(true);
  const ascChapters = [...chapters].reverse();

  return (
    <Container>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="all-chapters"
          id="all-chapters"
        >
          <Typography variant="subtitle1">See All Chapters</Typography>
        </AccordionSummary>
        <AccordionActions disableSpacing>
          <Button
            className={classes.chapterButton}
            onClick={() => setIsDesc(!isDesc)}
          >
            Sort By {isDesc ? "Ascending" : "Descending"}
          </Button>
        </AccordionActions>
        <AccordionDetails>
          <List className={classes.root}>
            {isDesc
              ? chapters.map((chapter) => {
                  return (
                    <ListItem
                      key={chapter.hash}
                      className="list"
                      alignItems="center"
                    >
                      <Button
                        className={classes.chapterButton}
                        style={{ width: "100%" }}
                        id={chapter.id}
                        component={Link}
                        to={`/manga/${chapter.mangaid}/chapter/${chapter.id}`}
                      >
                        <ChapterDatatoInfo chapter={chapter} />
                      </Button>
                    </ListItem>
                  );
                })
              : ascChapters.map((chapter) => {
                  return (
                    <ListItem
                      key={chapter.hash}
                      className="list"
                      alignItems="center"
                    >
                      <Button
                        className={classes.chapterButton}
                        style={{ width: "100%" }}
                        id={chapter.id}
                        component={Link}
                        to={`/manga/${chapter.mangaid}/chapter/${chapter.id}`}
                      >
                        <ChapterDatatoInfo chapter={chapter} />
                      </Button>
                    </ListItem>
                  );
                })}
          </List>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default ChapterList;
