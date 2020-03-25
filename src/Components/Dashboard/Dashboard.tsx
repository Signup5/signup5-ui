import {Card, Grid} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import {makeStyles, Theme} from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {CreateEventForm} from "./CreateEvent";
import {HostedEvents} from "./HostedEvents";
import {AllEvents} from "./AllEvents";
import {InvitationList} from "./Invitations";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}



function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;


  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: theme.palette.background.paper,
  }
}));

export const Dashboard: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          indicatorColor="primary"
        >
          <Tab label="Dashboard" {...a11yProps(0)} />
          <Tab label="Create event" {...a11yProps(1)} />
          <Tab label="My events" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <div style={{overflowY: "auto", flex: 1}}>
        <TabPanel value={value} index={0}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={8}>
                <AllEvents />
              </Grid>
              <Grid item xs={4}>
                <div style={{marginLeft: "23px"}}>
                  <InvitationList/>
                </div>
              </Grid>
            </Grid>
          </Grid>
    </TabPanel>
  <TabPanel value={value} index={1}>
    <CreateEventForm/>
  </TabPanel>
  <TabPanel value={value} index={2}>
    <HostedEvents/>
  </TabPanel>
</div>
</
  Card >
)
  ;
};
