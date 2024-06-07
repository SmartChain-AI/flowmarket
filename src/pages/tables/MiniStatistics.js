//import { Flex, Stat, StatLabel, StatNumber, useColorModeValue, Box } from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import React from "react";

const MiniStatistics = ({ amount, other }) => {
  const textColor = useColorModeValue("gray.400", "gray.400");
  const textColor2 = useColorModeValue("gray.700", "teal.300");
  const mainTeal = useColorModeValue("teal.500", "teal.300");

  return (
    <Card minH='83px'>
      <CardBody>
        <Flex flexDirection='row' align='center' justify='center' w='100%'>
          <Stat me='auto'>
            <StatLabel
              fontSize='lg'
              color='gray.400'
              fontWeight='bold'
            >
              {other ? (
                <Box sx={{ display: 'flex' }}>
                  <Box pb="2" w='75px' sx={{ display: 'inline-flex' }}><img src={other.im} alt="" width="50" height="50" /></Box>
                  <Box pb="2" ps="2" w='100%' sx={{ display: 'inline-flex', 'color': mainTeal, margin: 'auto' }}>{other.usname}</Box>
                </Box>
              ) : (
                <></>
              )}
            </StatLabel>
            <Flex>
              <StatNumber fontSize='lg' sx={{ display: 'flex' }}>
                <Box pt="4"><Box sx={{ 'color': textColor, display: 'inline-flex' }}>Floor Value:</Box><Box sx={{ color: textColor2, display: 'inline-flex' }} ps="2">{amount}</Box></Box>
              </StatNumber>
            </Flex>
          </Stat>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default MiniStatistics;
