
<?php

$data = $pages->find('events')->children()->published()->flip();
$json = [];

foreach($data as $event) {

  $json[] = [
    'url'   => (string)$event->url(),
    'name' => (string)$event->name(),
    'artists'  => (string)$event->artists(),
    'text'  => (string)$event->text(),
  ];

}


echo json_encode($json);