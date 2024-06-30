import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import React, { useState, useEffect } from "react";

const DailySales = () => {

  const theme = useTheme()
  var url = '/api/charts/momentstats/'

  const [chartstate, setChartstate] = useState({
    'options':
    {
      chart: {
        type: 'bar',
      },
   //   title: {
    //    text: 'Daily Sales',
    //  },
      noData: {
        text: 'Loading...'
      }
    },
    'series': []
  })

  useEffect(() => {

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let xaxis = []
        let series = []

        data.map((element) => {
          let newdate = element.date.split('T');
          xaxis.push(newdate[0])
          series.push(element.momentsalesdaytotal)
        });

        setChartstate({
          options: {
            chart: {
              id: "totalsales"
            },
            xaxis: {
              categories: xaxis,
              labels: {
                show: true,
                rotate: -45,
                rotateAlways: false,
                hideOverlappingLabels: true,
              }
            },
            yaxis: {
              labels: {
                formatter: (value) => {
                  return `$${parseInt(value)}`;
                },
              },
            },
            stroke: {
              width: 3,
              colors: [theme.palette.highlight.main]
            },
          },
          series: [{
            name: "Total Sales",
            data: series,
          }],
          dataLabels: {
            formatter: function (value) {
              return "$" + value
            }
          },
          colors: [
            theme.palette.background.default,
            theme.palette.background.default,
            theme.palette.background.default,
            theme.palette.primary.main,
            theme.palette.background.default,
            theme.palette.background.default
          ]
        })
      })
      .catch(console.error)

  }, [])

  return (
    <Card>
      <CardHeader
        title='Daily Sales'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts
          options={chartstate.options}
          series={chartstate.series}
          height="250"
          type="bar"
        />
        <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ mr: 4 }}>

          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default DailySales
