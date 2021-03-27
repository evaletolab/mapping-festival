<?php

$data = $pages->find('artists')->children()->published()->flip();
$json = [];

foreach($data as $artist) {

  $json[] = [
    'url'   => (string)$artist->url(),
    'first_name' => (string)$artist->first_name(),
    'last_name'  => (string)$artist->last_name(),
  ];

}


echo json_encode($json);