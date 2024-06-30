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

const WeeklyOverview = () => {
  const [chartstate, setChartstate] = useState({
    'options': 
      {
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
      },
    'series': []
  })
  const theme = useTheme()

  var url = '/api/charts/test/';

  useState(() => {

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.info(data)






        setChartstate({
          options: {
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
            }
          },
          series: [
            {
              name: "series-1",
              data: [30, 40, 45, 50, 49, 60, 70, 91]
            }
          ]
        })





        //  chart.updateSeries([{
        //  name: 'Sales',
        //    data: data[data]
        //  }])   

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
          type="bar"
          width="500"
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
