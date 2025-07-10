import re
import ssl
import socket
from typing import Dict, List, Optional, Any
from urllib.parse import urlparse
from textstat import flesch_reading_ease, flesch_kincaid_grade
from collections import Counter
import aiohttp
import asyncio
from datetime import datetime
import math

from app.models.schemas import SEOMetrics


class AdvancedSEOAnalyzer:
    def __init__(self):
        self.stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
            'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 
            'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
            'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
        }
    
    async def analyze_content(self, html_content: str, url: str) -> Dict[str, Any]:
        """Perform comprehensive content analysis"""
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Extract text content
        text_content = self._extract_text_content(soup)
        
        analysis = {
            'word_count': self._count_words(text_content),
            'character_count': len(text_content),
            'paragraph_count': len(soup.find_all('p')),
            'sentence_count': self._count_sentences(text_content),
            'keyword_density': self._calculate_keyword_density(text_content),
            'readability_score': self._calculate_readability(text_content),
            'content_freshness': await self._analyze_content_freshness(soup),
            'content_uniqueness': self._analyze_content_uniqueness(text_content),
            'heading_structure': self._analyze_heading_structure(soup),
            'link_analysis': self._analyze_links(soup, url),
            'image_analysis': self._analyze_images(soup),
            'content_gaps': self._identify_content_gaps(text_content),
            'topic_coverage': self._analyze_topic_coverage(text_content)
        }
        
        return analysis
    
    def _extract_text_content(self, soup) -> str:
        """Extract clean text content from HTML"""
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text
        text = soup.get_text()
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
    
    def _count_words(self, text: str) -> int:
        """Count words in text"""
        words = re.findall(r'\b\w+\b', text.lower())
        return len(words)
    
    def _count_sentences(self, text: str) -> int:
        """Count sentences in text"""
        sentences = re.split(r'[.!?]+', text)
        return len([s for s in sentences if s.strip()])
    
    def _calculate_keyword_density(self, text: str) -> Dict[str, float]:
        """Calculate keyword density"""
        words = re.findall(r'\b\w+\b', text.lower())
        words = [word for word in words if word not in self.stop_words and len(word) > 2]
        
        word_count = len(words)
        if word_count == 0:
            return {}
        
        word_freq = Counter(words)
        
        # Calculate density for top 20 keywords
        keyword_density = {}
        for word, freq in word_freq.most_common(20):
            density = (freq / word_count) * 100
            keyword_density[word] = round(density, 2)
        
        return keyword_density
    
    def _calculate_readability(self, text: str) -> Dict[str, float]:
        """Calculate readability scores"""
        if not text.strip():
            return {'flesch_reading_ease': 0, 'flesch_kincaid_grade': 0}
        
        try:
            return {
                'flesch_reading_ease': flesch_reading_ease(text),
                'flesch_kincaid_grade': flesch_kincaid_grade(text)
            }
        except:
            return {'flesch_reading_ease': 0, 'flesch_kincaid_grade': 0}
    
    async def _analyze_content_freshness(self, soup) -> Dict[str, Any]:
        """Analyze content freshness indicators"""
        freshness_indicators = {
            'last_modified': None,
            'publication_date': None,
            'updated_date': None,
            'date_mentions': [],
            'time_sensitive_content': False
        }
        
        # Check for last modified meta tag
        last_modified = soup.find('meta', {'http-equiv': 'last-modified'})
        if last_modified:
            freshness_indicators['last_modified'] = last_modified.get('content')
        
        # Check for publication date in structured data
        json_ld_scripts = soup.find_all('script', type='application/ld+json')
        for script in json_ld_scripts:
            try:
                import json
                data = json.loads(script.string)
                if isinstance(data, dict):
                    if 'datePublished' in data:
                        freshness_indicators['publication_date'] = data['datePublished']
                    if 'dateModified' in data:
                        freshness_indicators['updated_date'] = data['dateModified']
            except:
                pass
        
        # Look for date mentions in text
        text = soup.get_text()
        date_patterns = [
            r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',
            r'\b\d{4}-\d{2}-\d{2}\b',
            r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b'
        ]
        
        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            freshness_indicators['date_mentions'].extend(matches)
        
        # Check for time-sensitive keywords
        time_sensitive_keywords = ['today', 'yesterday', 'tomorrow', 'this week', 'this month', 'this year', 'recently', 'latest', 'current', 'now']
        text_lower = text.lower()
        freshness_indicators['time_sensitive_content'] = any(keyword in text_lower for keyword in time_sensitive_keywords)
        
        return freshness_indicators
    
    def _analyze_content_uniqueness(self, text: str) -> Dict[str, Any]:
        """Analyze content uniqueness"""
        # Simple uniqueness analysis
        sentences = re.split(r'[.!?]+', text)
        sentence_lengths = [len(sentence.strip()) for sentence in sentences if sentence.strip()]
        
        uniqueness_score = 0
        if sentence_lengths:
            avg_sentence_length = sum(sentence_lengths) / len(sentence_lengths)
            length_variance = sum((length - avg_sentence_length) ** 2 for length in sentence_lengths) / len(sentence_lengths)
            uniqueness_score = min(100, math.sqrt(length_variance) / avg_sentence_length * 100)
        
        return {
            'uniqueness_score': round(uniqueness_score, 2),
            'sentence_count': len(sentences),
            'average_sentence_length': round(sum(sentence_lengths) / len(sentence_lengths), 2) if sentence_lengths else 0,
            'content_diversity': self._calculate_content_diversity(text)
        }
    
    def _calculate_content_diversity(self, text: str) -> float:
        """Calculate content diversity based on vocabulary richness"""
        words = re.findall(r'\b\w+\b', text.lower())
        words = [word for word in words if word not in self.stop_words and len(word) > 2]
        
        if not words:
            return 0
        
        unique_words = len(set(words))
        total_words = len(words)
        
        # Type-Token Ratio
        diversity_score = (unique_words / total_words) * 100
        return round(diversity_score, 2)
    
    def _analyze_heading_structure(self, soup) -> Dict[str, Any]:
        """Analyze heading structure and hierarchy"""
        headings = []
        for i in range(1, 7):
            heading_tags = soup.find_all(f'h{i}')
            for tag in heading_tags:
                headings.append({
                    'level': i,
                    'text': tag.get_text().strip(),
                    'length': len(tag.get_text().strip())
                })
        
        # Analyze hierarchy
        hierarchy_issues = []
        prev_level = 0
        for heading in headings:
            level = heading['level']
            if prev_level > 0 and level > prev_level + 1:
                hierarchy_issues.append(f"Heading level {level} follows H{prev_level} (skipped H{prev_level + 1})")
            prev_level = level
        
        return {
            'total_headings': len(headings),
            'heading_distribution': Counter(h['level'] for h in headings),
            'hierarchy_issues': hierarchy_issues,
            'average_heading_length': round(sum(h['length'] for h in headings) / len(headings), 2) if headings else 0,
            'headings': headings
        }
    
    def _analyze_links(self, soup, base_url: str) -> Dict[str, Any]:
        """Analyze link structure and quality"""
        links = soup.find_all('a', href=True)
        
        internal_links = []
        external_links = []
        broken_links = []
        
        base_domain = urlparse(base_url).netloc
        
        for link in links:
            href = link.get('href')
            text = link.get_text().strip()
            
            # Categorize link
            if href.startswith('http'):
                link_domain = urlparse(href).netloc
                if link_domain == base_domain:
                    internal_links.append({'url': href, 'text': text})
                else:
                    external_links.append({'url': href, 'text': text})
            elif href.startswith('/'):
                internal_links.append({'url': href, 'text': text})
        
        # Analyze link quality
        link_quality = {
            'descriptive_links': sum(1 for link in internal_links + external_links if len(link['text']) > 5),
            'total_links': len(internal_links) + len(external_links),
            'internal_to_external_ratio': len(internal_links) / len(external_links) if external_links else float('inf'),
            'anchor_text_analysis': self._analyze_anchor_text([link['text'] for link in internal_links + external_links])
        }
        
        return {
            'internal_links': internal_links,
            'external_links': external_links,
            'link_quality': link_quality
        }
    
    def _analyze_anchor_text(self, anchor_texts: List[str]) -> Dict[str, Any]:
        """Analyze anchor text quality"""
        generic_anchors = ['click here', 'read more', 'learn more', 'here', 'more', 'link']
        
        total_anchors = len(anchor_texts)
        generic_count = sum(1 for text in anchor_texts if text.lower() in generic_anchors)
        
        return {
            'total_anchors': total_anchors,
            'generic_anchors': generic_count,
            'descriptive_anchors': total_anchors - generic_count,
            'average_anchor_length': round(sum(len(text) for text in anchor_texts) / total_anchors, 2) if total_anchors else 0
        }
    
    def _analyze_images(self, soup) -> Dict[str, Any]:
        """Analyze image optimization"""
        images = soup.find_all('img')
        
        image_analysis = {
            'total_images': len(images),
            'images_with_alt': sum(1 for img in images if img.get('alt')),
            'images_with_title': sum(1 for img in images if img.get('title')),
            'images_with_lazy_loading': sum(1 for img in images if img.get('loading') == 'lazy'),
            'image_formats': {},
            'optimization_issues': []
        }
        
        # Analyze image formats
        for img in images:
            src = img.get('src', '')
            if src:
                ext = src.split('.')[-1].lower()
                image_analysis['image_formats'][ext] = image_analysis['image_formats'].get(ext, 0) + 1
        
        # Identify optimization issues
        if image_analysis['images_with_alt'] < len(images):
            image_analysis['optimization_issues'].append(f"{len(images) - image_analysis['images_with_alt']} images missing alt text")
        
        if image_analysis['images_with_lazy_loading'] == 0 and len(images) > 3:
            image_analysis['optimization_issues'].append("Consider implementing lazy loading for images")
        
        return image_analysis
    
    def _identify_content_gaps(self, text: str) -> List[str]:
        """Identify potential content gaps"""
        gaps = []
        
        # Check for common SEO elements
        text_lower = text.lower()
        
        # Check for call-to-action
        cta_keywords = ['contact', 'buy', 'purchase', 'subscribe', 'download', 'sign up', 'register']
        if not any(keyword in text_lower for keyword in cta_keywords):
            gaps.append("Missing call-to-action elements")
        
        # Check for FAQ content
        if 'faq' not in text_lower and 'frequently asked' not in text_lower:
            gaps.append("Consider adding FAQ section")
        
        # Check for contact information
        contact_keywords = ['contact', 'email', 'phone', 'address']
        if not any(keyword in text_lower for keyword in contact_keywords):
            gaps.append("Missing contact information")
        
        # Check for testimonials/reviews
        testimonial_keywords = ['testimonial', 'review', 'feedback', 'customer']
        if not any(keyword in text_lower for keyword in testimonial_keywords):
            gaps.append("Consider adding testimonials or reviews")
        
        return gaps
    
    def _analyze_topic_coverage(self, text: str) -> Dict[str, Any]:
        """Analyze topic coverage and depth"""
        words = re.findall(r'\b\w+\b', text.lower())
        words = [word for word in words if word not in self.stop_words and len(word) > 3]
        
        if not words:
            return {'topic_depth': 0, 'main_topics': []}
        
        word_freq = Counter(words)
        
        # Identify main topics (top 10 most frequent words)
        main_topics = [word for word, freq in word_freq.most_common(10)]
        
        # Calculate topic depth based on vocabulary richness
        unique_words = len(set(words))
        total_words = len(words)
        topic_depth = (unique_words / total_words) * 100
        
        return {
            'topic_depth': round(topic_depth, 2),
            'main_topics': main_topics,
            'topic_distribution': dict(word_freq.most_common(10))
        }
    
    async def analyze_ssl_certificate(self, url: str) -> Dict[str, Any]:
        """Analyze SSL certificate information"""
        try:
            parsed_url = urlparse(url)
            hostname = parsed_url.hostname
            port = parsed_url.port or (443 if parsed_url.scheme == 'https' else 80)
            
            if parsed_url.scheme != 'https':
                return {
                    'ssl_enabled': False,
                    'error': 'Site does not use HTTPS'
                }
            
            # Get SSL certificate info
            context = ssl.create_default_context()
            with socket.create_connection((hostname, port), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    
                    # Parse certificate info
                    ssl_info = {
                        'ssl_enabled': True,
                        'issuer': dict(x[0] for x in cert.get('issuer', [])),
                        'subject': dict(x[0] for x in cert.get('subject', [])),
                        'version': cert.get('version'),
                        'serial_number': cert.get('serialNumber'),
                        'not_before': cert.get('notBefore'),
                        'not_after': cert.get('notAfter'),
                        'signature_algorithm': cert.get('signatureAlgorithm'),
                        'extensions': []
                    }
                    
                    # Check certificate validity
                    from datetime import datetime
                    not_after = datetime.strptime(cert.get('notAfter'), '%b %d %H:%M:%S %Y %Z')
                    days_until_expiry = (not_after - datetime.now()).days
                    
                    ssl_info['days_until_expiry'] = days_until_expiry
                    ssl_info['expires_soon'] = days_until_expiry < 30
                    
                    return ssl_info
        
        except Exception as e:
            return {
                'ssl_enabled': False,
                'error': str(e)
            }
    
    async def analyze_page_speed(self, url: str) -> Dict[str, Any]:
        """Analyze page speed using web vitals"""
        try:
            import time
            start_time = time.time()
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    content = await response.text()
                    load_time = time.time() - start_time
                    
                    # Basic performance metrics
                    performance_metrics = {
                        'load_time': round(load_time, 2),
                        'page_size': len(content.encode('utf-8')),
                        'response_code': response.status,
                        'content_type': response.headers.get('content-type', ''),
                        'server': response.headers.get('server', ''),
                        'cache_control': response.headers.get('cache-control', ''),
                        'performance_score': self._calculate_performance_score(load_time, len(content))
                    }
                    
                    return performance_metrics
        
        except Exception as e:
            return {
                'error': str(e),
                'load_time': None,
                'page_size': None
            }
    
    def _calculate_performance_score(self, load_time: float, page_size: int) -> float:
        """Calculate performance score based on load time and page size"""
        # Simple scoring algorithm
        time_score = max(0, 100 - (load_time * 20))  # Penalty for slow load times
        size_score = max(0, 100 - (page_size / 10000))  # Penalty for large pages
        
        return round((time_score + size_score) / 2, 2)