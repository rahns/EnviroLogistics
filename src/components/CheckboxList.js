// Adapted from https://material-ui.com/components/lists/
// Assumes each list element has a toString method defined

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { CheckCircleRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function CheckboxList({ items, checked, handleToggle }) {
    const classes = useStyles();
    return (
        <List className={classes.root}>
            {items.map((item, index) => {
                const labelId = `checkbox-list-label-${index}`;

                return (
                    <ListItem key={index} dense button onClick={handleToggle(checked)(item)}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={checked.indexOf(item) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={item.toString()} />
                    </ListItem>
                );
            })}
        </List>
    );
}