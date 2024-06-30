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
import CircularProgress from '@mui/joy/CircularProgress';


const WeeklyOverview = () => {
  const [chartstate, setChartstate] = useState({
    'options':
    {
    //  chart: {
     //   width: '100%',
     //   type: 'bar',
     // },
      chart: {
       // height: 550,
        type: 'line',
      },
      series: [],
      title: {
        text: 'test',
      },
      noData: {
        text: 'Loading...'
      }
    },
    'series': []
  })
  const theme = useTheme()

  var url = '/api/charts/momentstats/';

  useEffect(() => {

    fetch(url)
      .then((response) => response.json())
      .then((data) => {

        let xaxis = []
        let series1 = []

        data.map((element) => {

          let newdate = element.date.split('T');
          xaxis.push(newdate[0])
          series1.push(element.momentsalesdaytotal)

        });

        setChartstate({
          options: {
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: xaxis
            }
          },
          series: [{
              name: "Date",
              data: series1
            }],
            colors: [
              theme.palette.background.default,
              theme.palette.background.default,
              theme.palette.background.default,
              theme.palette.primary.main,
              theme.palette.background.default,
              theme.palette.background.default
            ],
        })
      })
      .catch(console.error)

  }, [])

  const options2 = {
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.primary.main]
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.background.default,
      theme.palette.background.default,
      theme.palette.background.default,
      theme.palette.primary.main,
      theme.palette.background.default,
      theme.palette.background.default
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    chart: {
      height: 550,
      type: 'bar',
    },
    series: [],
    title: {
      text: 'test',
    },
    noData: {
      text: 'Loading...'
    }
  }

  return (
    <Card>
      <CardHeader
        title='Weekly Overview'
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


        <ReactApexcharts type='line'
          // height={205} 
          options={options2} series={[{ data: [37, 57, 45, 75, 57, 40, 65] }]} />

        <ReactApexcharts
          options={chartstate.options}
          series={chartstate.series}
          type="line"
          height="500"
        />

        <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ mr: 4 }}>
            45%
          </Typography>
        </Box>
        <Button fullWidth variant='contained'>
          Details
        </Button>
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
