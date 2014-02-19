#!/usr/bin/env perl
use 5.16.2;
use strict;
use warnings;
use utf8;
use SVG;

my $svg = SVG->new(
        -printerror => 1,
        -raiseerror => 0,
        -indent     => '  ',
        -docroot => '', #default document root element (SVG specification assumes svg). Defaults to 'svg' if undefined
        -sysid      => 'abc', #optional system identifyer
        -pubid      => "-//W3C//DTD SVG 1.0//EN", #public identifyer default value is "-//W3C//DTD SVG 1.0//EN" if undefined
#        -namespace => 'controls',
        -inline   => 1 ,
        id          => 'largePlayButton',
        width       => 50,
        height      => 50,
);

$svg->circle(cx => 25 , cy => 25 , r => 25 , stroke => 'black',fill => "red" );
my $points = $svg->get_path(x => [25 - 10 , 25- 10 , 25 + 14 ], y => [25 - 14 , 25 + 10 , 25] ,-type => 'polyline'  ,-closed=>'true');
$svg->polyline(%$points , stroke => 'black', fill => 'pink');
say $svg->xmlify
