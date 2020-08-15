import React from 'react'
import { Card, CardContent, Typography} from '@material-ui/core';
import './InfoBox.css';
function InfoBox({title, cases, total, active,isRed, ...props}) {
    return (
        <Card onClick={props.onClick}  className={`infoBox ${active && "infoBox--selected"} ${
                isRed && "infoBox--red"
            }`}>
            <CardContent>
                {/* Titulo */}  
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                {/* ++ Numero de casos */}  
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>
                {/* Total acumulado */}           
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>

        </Card>
    )
}

export default InfoBox
