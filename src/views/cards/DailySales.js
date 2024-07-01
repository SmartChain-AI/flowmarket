import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import React, { useState, useEffect } from "react";
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const DailySales = () => {

  const theme = useTheme()
  var url = '/api/charts/momentstats/'

  const [chartstate, setChartstate] = useState({
    'options':
    {
      chart: {
        type: 'column',
        height:"250"
      },
      xaxis: {
        labels: {
          show: false,
        }
      },
      yaxis: {
        labels: {
          show: false,
        }
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
        let lineseries = []
        let barseries = []

        data.map((element) => {
          // let newdate = element.date.split('T');
          let localdate = new Date(element.date); 
          //xaxis.push(localdate.toString())
          xaxis.push(localdate.toDateString())
          lineseries.push(element.momentsalesdaytotal)
          barseries.push(element.momentsalesdaycount)
        });

        setChartstate({
          options: {
            chart: {
              id: "totalsales",
              dropShadow: {
                enabled: true,
                top: 3,
                left: 2,
                blur: 4,
                opacity: 1,
              }
            },
            xaxis: {
              categories: xaxis,
              labels: {
                show: true,
                rotate: -45,
                rotateAlways: false,
                hideOverlappingLabels: true,
                type: 'datetime'
              },
              dataLabels: {
                formatter: function (value) {
                  return "$" + value
                }
              },
            },
            yaxis: [
              {
                dataLabels: {
                  enabled: true,
                  enabledOnSeries: [1],
                  formatter: (value) => {
                    return `$${parseInt(value)}`;
                  },
                },
              },
              {
                opposite: true,
                title: {
                  text: 'Total Sales'
                },
                labels: {
                  formatter: (value) => {
                    return `$${parseInt(value)}`;
                  },
                }
              }
            ],
            grid: {
              show: true,
              padding: {
                bottom: 0
              }
            },
            legend: {
              position: 'top',
              horizontalAlign: 'left',
              offsetY: 0,
            },
            stroke: {
              curve: 'smooth',
              width: 2
            },
            markers: {
              size: 10,
              strokeWidth: 0,
              hover: {
                size: 9
              },
              shape: "square" // "circle" | "square" | "rect"
            },
            stroke: {
              width: 2,
              colors: [theme.palette.highlight.main]
            },
          },
          series: [{
            name: 'Moments Sold',
            type: 'column',
            data: barseries
          }, {
            name: 'Total Sales',
            type: 'line',
            data: lineseries
          }],
          dataLabels: {
            formatter: function (value) {
              return "$" + value
            }
          }
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
      <ApexChartWrapper>
        <ReactApexcharts
          options={chartstate.options}
          series={chartstate.series}
          height="250"
          type="bar"
        />
        </ApexChartWrapper>
        <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ mr: 4 }}>

          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default DailySales
